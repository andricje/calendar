import json
import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import List

import pytz
import requests
from bs4 import BeautifulSoup
from ics import Calendar, Event

UTC = pytz.utc
PST = pytz.timezone("US/Pacific")

logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


class CalendarControl:
    def __init__(self) -> None:
        self.event_calendar = Calendar()
        self.log = logging.getLogger(__name__)
        self.last_update: datetime = None

        self.update_calendar()

    def get_last_updated_string(self) -> str:
        """Get a nicely formatted string version of the last updated value

        Returns:
            str: String representation for the time adjusted for PST
        """
        if not self.last_update:
            return "Updating now..."
        return self.last_update.astimezone(PST).strftime("%Y-%m-%d %H:%M")

    def get_event_links(self) -> List[str]:
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
