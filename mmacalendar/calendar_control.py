# pylint: disable=missing-timeout,logging-fstring-interpolation,missing-module-docstring
import json
import logging
import sys
from abc import ABCMeta, abstractmethod
from datetime import datetime, timedelta
from pathlib import Path

import pytz
import requests
from bs4 import BeautifulSoup
from ics import Calendar, Event

logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


class CalendarControl(metaclass=ABCMeta):
    UTC = pytz.utc
    PST = pytz.timezone("US/Pacific")

    def __init__(self) -> None:
        self.event_calendar = Calendar()
        self.log = logging.getLogger(__name__)
        self.last_update: datetime = None

        try:
            self.update_calendar()
        except:
            self.log.exception(f"{self.__class__} failed to initialize")

    def get_last_updated_string(self) -> str:
        """Get a nicely formatted string version of the last updated value

        Returns:
            str: String representation for the time adjusted for PST
        """
        if not self.last_update:
            return "Updating now..."
        return self.last_update.astimezone(self.PST).strftime("%Y-%m-%d %H:%M")

    def time_to_update(self) -> bool:
        """Determine if the application should check for event updates

        Returns:
            bool: True if the last check was at least 24 hours ago
        """
        if not self.last_update:
            return True
        time_difference = datetime.now(tz=self.UTC) - self.last_update
        self.log.info(f"Days since last update: {time_difference.days}")
        if time_difference.days:
            return True
        self.log.info(f"Last update was {self.last_update.astimezone(self.PST)}")
        return False

    def update_existing_event(self, event: Event):
        """Update existing event if one is present in the calendar, otherwise create the event.

        Args:
            event (Event): Event to add or update.
        """
        for existing_event in self.event_calendar.events:
            if event.url == existing_event.url and event.name == existing_event.name:
                self.event_calendar.events.discard(existing_event)
                self.event_calendar.events.add(event)
                return
        self.event_calendar.events.add(event)

    @abstractmethod
    def update_calendar(self) -> Path:
        """Update the calendar file with the latest details

        Returns:
            Path: Calendar file location the serve to the client
        """


class UfcCalendar(CalendarControl):
    """Fetch event data and build calendar for UFC Schedule"""

    def get_event_links(self) -> list[str]:
        """Get all the event links from UFC website.

        Returns:
            list[str]: Event URLs to check for event times.
        """
        base_url = "https://www.ufc.com"
        soup = BeautifulSoup(
            requests.get(f"{base_url}/events").text, features="html.parser"
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
        match part:
            case "Main Card":
                part_id = "main-card"
            case "Prelims":
                part_id = "prelims-card"
            case "Early Prelims":
                part_id = "early-prelims"
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
        event_soup = BeautifulSoup(requests.get(url).text, features="html.parser")
        main_title = " ".join(
            [
                i.strip()
                for i in event_soup.select_one("div.c-hero__header").text.split("\n")
                if i
            ]
        ).strip()

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
        for url in self.get_event_links():
            for event in self.get_events_from_url(url):
                self.update_existing_event(event)
        with open(file_path, "w", encoding="UTF-8") as calendar_file:
            calendar_file.writelines(self.event_calendar)
        self.log.info(
            f"Writing out {len(self.event_calendar.events)} events on calendar to {file_path}"
        )
        self.last_update = datetime.now(tz=self.UTC)
        return file_path


class OneFcCalendar(CalendarControl):
    """Fetch event data and build calendar for One FC Schedule"""

    def get_event_links(self) -> list[str]:
        """Find all the upcoming event links

        Returns:
            List[str]: List of all upcoming event URL's
        """
        soup = BeautifulSoup(
            requests.get(
                "https://www.onefc.com/events/",
            ).text,
            features="html.parser",
        )
        return [
            event["href"]
            for event in soup.select(
                "div#upcoming-events-section div.simple-post-card a.title"
            )
        ]

    def get_event_from_url(self, url: str) -> Event:
        """Get the event data from the individual event URL

        Args:
            url (str): URL to individual event page

        Returns:
            Event: Event for the calendar with all available details
        """
        event_soup = BeautifulSoup(requests.get(url).text, features="html.parser")
        event_title = event_soup.select_one("div.info-content h3").get_text(strip=True)
        event_id = event_soup.find(attrs={"class", "status-countdown"})["data-id"]
        event_data = json.loads(
            requests.get(
                f"https://www.onefc.com/wp-admin/admin-ajax.php?action=query_event_info&id={event_id}",
            ).text
        )
        start_offset_sec = event_data["data"]["time_to_start"]
        start_time = datetime.now() + timedelta(seconds=start_offset_sec)

        if event_description := event_soup.select_one("div.editor-content p"):
            event_description = event_description.get_text(strip=True)

        return Event(
            name=event_title,
            description=event_description if event_description else "Coming soon...",
            begin=start_time,
            end=(start_time + timedelta(hours=5)),
            url=url,
        )

    def update_calendar(self) -> Path:
        """Update the calendar file with the latest details

        Returns:
            Path: Calendar file location the serve to the client
        """
        file_path = Path(__file__).parent.resolve() / "data/onefc.ics"
        if not self.time_to_update():
            return file_path
        self.log.info("Starting calendar update")
        for url in self.get_event_links():
            event = self.get_event_from_url(url)
            self.update_existing_event(event)
        with open(file_path, "w", encoding="UTF-8") as calendar_file:
            calendar_file.writelines(self.event_calendar)
        self.log.info(
            f"Writing out {len(self.event_calendar.events)} events on calendar to {file_path}"
        )
        self.last_update = datetime.now(tz=self.UTC)
        return file_path
