import json
import sys
import logging
import requests
import pytz
from typing import List
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from ics import Calendar, Event
from pathlib import Path

UTC = pytz.utc
PST = pytz.timezone("US/Pacific")

logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


class CalendarControl:
    def __init__(self) -> None:
        self.soup = BeautifulSoup(
            self.get_events_page(), features="html.parser")
        self.event_calendar = Calendar()
        self.log = logging.getLogger(__name__)
        self.last_update: datetime = None

    def get_events_page(self) -> str:
        """Retrieve the events page HTML as text

        Returns:
            str: Events page HTML as text
        """
        raw_events_page = requests.get("https://www.onefc.com/events/")
        return raw_events_page.text

    def get_event_links(self) -> List[str]:
        """Find all the upcoming event links

        Returns:
            List[str]: List of all upcoming event URL's
        """
        return [event["href"] for event in self.soup.select("div#upcoming-events-section div.simple-post-card a.title")]

    def get_event_from_url(self, url: str) -> Event:
        """Get the event data from the individual event URL

        Args:
            url (str): URL to individual event page

        Returns:
            Event: Event for the calendar with all available details
        """
        event_soup = BeautifulSoup(requests.get(
            url).text, features="html.parser")
        event_title = event_soup.select_one(
            "div.info-content h3").get_text(strip=True)
        event_id = event_soup.find(
            attrs={"class", "status-countdown"})["data-id"]
        event_data = json.loads(requests.get(
            f"https://www.onefc.com/wp-admin/admin-ajax.php?action=query_event_info&id={event_id}").text)
        start_offset_sec = event_data["data"]["time_to_start"]
        start_time = datetime.now() + timedelta(seconds=start_offset_sec)

        if event_description := event_soup.select_one("div.editor-content p"):
            event_description = event_description.get_text(strip=True)

        return Event(name=event_title, description=event_description if event_description else "Coming soon...", begin=start_time, end=(start_time+timedelta(hours=8)), url=url)

    def time_to_update(self) -> bool:
        """Determine if the application should check for event updates

        Returns:
            bool: True if the last check was at least 24 hours ago
        """
        if not self.last_update:
            return True
        time_difference = datetime.now(tz=UTC) - self.last_update
        self.log.info(f"Days since last update: {time_difference.days}")
        if time_difference.days:
            return True
        self.log.info(f"Last update was {self.last_update.astimezone(PST)}")
        return False

    def update_calendar(self) -> Path:
        """Update the calendar file with the latest details

        Returns:
            Path: Calendar file location the serve to the client
        """
        file_path = Path(__file__).parent.resolve() / "data/onefc.ics"
        if not self.time_to_update():
            return file_path
        self.log.info("Starting calendar update")
        self.event_calendar.events.clear()
        for url in self.get_event_links():
            event = self.get_event_from_url(url)
            self.event_calendar.events.add(event)
        with open(file_path, "w") as calendar_file:
            calendar_file.writelines(self.event_calendar)
        self.log.info(
            f"Writing out {len(self.event_calendar.events)} events on calendar to {file_path}"
        )
        self.last_update = datetime.now(tz=UTC)
        return file_path
