from pathlib import Path
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from backend.calendar_control import CalendarControl, Event, global_cache_manager


class UfcCalendar(CalendarControl):
    """Fetch event data and build calendar for UFC Schedule"""

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"
    }

    def get_event_links(self) -> list[str]:
        """Get all the event links from UFC website.

        Returns:
            list[str]: Event URLs to check for event times.
        """
        base_url = "https://www.ufc.com"
        soup = BeautifulSoup(
            requests.get(f"{base_url}/events", headers=self.headers).content,
            features="html.parser",
        )

        return [
            f"{base_url}{link['href']}"
            for link in soup.select("article > div.c-card-event--result__info > h3 > a")
        ]

    def get_fighters_for_part(self, part: str, soup: BeautifulSoup) -> list[str]:
        """Get the fighters for a given event.

        Args:
            part (str): Description of the part to retrieve fighters names.
            soup (BeautifulSoup): Page markup.

        Returns:
            list[str]: List of "Red Corner vs Blue Corner" for the given part.
        """
        if part == "Main Card":
            part_id = "main-card"
        elif part == "Prelims":
            part_id = "prelims-card"
        elif part == "Early Prelims":
            part_id = "early-prelims"
        else:
            part_id = "main-card"
        event_section = soup.select_one(f"#{part_id}")
        if not event_section:
            return []
        red_corner = [
            fighters.get_text().replace("\n", " ").strip()
            for fighters in event_section.select(".c-listing-fight__corner-name--red")
        ]
        blue_corner = [
            fighters.get_text().replace("\n", " ").strip()
            for fighters in event_section.select(".c-listing-fight__corner-name--blue")
        ]

        return [f"{red} vs {blue}" for red, blue in zip(red_corner, blue_corner)]

    def get_events_from_url(self, url: str) -> list[Event]:
        """Generate event segments from URL.

        Args:
            url (str): URL for target event.

        Returns:
            list[Event]: All events scheduled for the target URL.
        """
        event_soup = BeautifulSoup(
            requests.get(url, headers=self.headers).content, features="html.parser"
        )
        try:
            main_title = " ".join(
                [
                    i.strip()
                    for i in event_soup.select_one("div.c-hero__header").text.split(
                        "\n"
                    )
                    if i
                ]
            ).strip()
        except AttributeError:
            self.log.critical(
                f"Failed to locate an event title for {url}. Check the event page for changes or errors.",
                exc_info=True,
            )
            return []

        events: Event = []
        event_parts = event_soup.select("ul ul li.c-listing-viewing-option-group__item")
        for part in event_parts:
            part_title = part.find(
                "div", {"class": "c-listing-viewing-option__fight-card"}
            ).get_text(strip=True)
            part_start_time = datetime.fromtimestamp(
                int(
                    part.find("div", {"class": "c-listing-viewing-option__time"})[
                        "data-timestamp"
                    ]
                ),
                self.UTC,
            )
            part_fighters = "\n".join(
                self.get_fighters_for_part(part_title.strip(), event_soup)
            )
            if editor_description := event_soup.select_one("div.editor-content p"):
                editor_description = editor_description.get_text(strip=True)
            else:
                editor_description = "Featured fighters:"

            event_description = f"{editor_description}\n{part_fighters}"

            if events:
                # UFC site has incorrectly shown the prelims starting hours after the main card.
                # This check works around that problem by not updating the end time of the previous event if this site error occurs.
                if not events[-1].begin > part_start_time:
                    events[-1].end = part_start_time

            events.append(
                Event(
                    name=f"{part_title} - {main_title}",
                    begin=part_start_time,
                    description=event_description,
                    end=(part_start_time + timedelta(hours=2)),
                    url=url,
                )
            )
        return events

    def update_calendar(self) -> Path:
        """Update the calendar file with the latest details

        Returns:
            Path: Calendar file location the serve to the client
        """
        file_path = Path(__file__).parent.resolve() / "data/ufc.ics"
        if not self.time_to_update():
            return file_path
        self.log.info("Starting calendar update")
        success = True
        try:
            for url in self.get_event_links():
                for event in self.get_events_from_url(url):
                    self.update_existing_event(event)
            with open(file_path, "w", encoding="UTF-8") as calendar_file:
                calendar_file.writelines(self.event_calendar)
            events_count = len(self.event_calendar.events)
            self.log.info(
                f"Writing out {events_count} events on calendar to {file_path}"
            )
            self.last_update = datetime.now(tz=self.UTC)
            global_cache_manager.update_service_stats("ufc", True, events_count=events_count)
        except Exception:
            success = False
            global_cache_manager.update_service_stats("ufc", False)
            raise
        finally:
            global_cache_manager.update_service_stats("backend", success)
        return file_path
