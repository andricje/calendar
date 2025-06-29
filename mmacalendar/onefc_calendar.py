from pathlib import Path
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from .calendar_control import CalendarControl, Event


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
            ).content,
            features="html.parser",
        )
        return [
            event["href"]
            for event in soup.select(
                "div#upcoming-events-section div.simple-post-card a.title"
            )
        ]

    def get_fighters_for_part(self, soup: BeautifulSoup) -> list[str]:
        """Get the fighters from the event page.

        Args:
            soup (BeautifulSoup): Event HTML to search through.

        Returns:
            list[str]: List of the fighters found on the page.
        """
        # TODO: Figure out how to get the type of fight/event. I.E. Muay Tai, MMA, Kickboxing
        return [
            fighter.string.strip()
            for fighter in soup.find_all("div", {"class": "versus"})
        ]

    def get_event_description(self, soup: BeautifulSoup, url: str) -> str:
        """Create the event description based on available data from the page.

        Args:
            soup (BeautifulSoup): Event HTML.
            url (str): URL of the event

        Returns:
            str: Description of the even with the fighters if available.
        """
        if event_description := soup.select_one("div.editor-content p"):
            event_description = event_description.get_text(strip=True)
        fighters = "\n".join(
            self.get_fighters_for_part(
                BeautifulSoup(requests.get(url).content, features="html.parser")
            )
        )

        if event_description:
            return f"{event_description}\n\n{fighters}"

        return "Coming Soon..."

    def get_event_from_url(self, url: str) -> Event:
        """Get the event data from the individual event URL

        Args:
            url (str): URL to individual event page

        Returns:
            Event: Event for the calendar with all available details
        """
        event_soup = BeautifulSoup(requests.get(url).content, features="html.parser")
        event_title = event_soup.select_one("div.info-content h3").get_text(strip=True)
        event_id = event_soup.find(attrs={"class", "status-countdown"})["data-id"]
        event_data = requests.get(
            f"https://www.onefc.com/wp-json/public/v2/events/{event_id}",
        ).json()
        start_offset_sec = event_data["utc_start"]
        start_time = datetime.fromtimestamp(start_offset_sec)

        return Event(
            name=event_title,
            description=self.get_event_description(event_soup, url),
            begin=start_time,
            end=(start_time + timedelta(hours=3)),
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
