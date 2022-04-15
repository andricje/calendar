import sys
import logging
import requests
import pytz
from typing import List
from datetime import datetime
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
        self.soup = BeautifulSoup(self.get_events_page(), features="html.parser")
        self.event_calendar = Calendar()
        self.all_events: List[Event] = []
        self.log = logging.getLogger(__name__)
        self.last_update: datetime = None

    def get_events_page(self) -> str:
        raw_events_page = requests.get("https://www.onefc.com/events/")
        return raw_events_page.text

    def get_next_event(self) -> Event:
        next_event_container = self.soup.find(id="event-banner")
        event_name = next_event_container.find(attrs={"itemprop": "name"})["content"]
        event_description = next_event_container.find(
            attrs={"itemprop": "description"}
        )["content"]
        start_time = datetime.fromisoformat(
            next_event_container.find(attrs={"itemprop": "startDate"})["content"]
        )
        end_time = datetime.fromisoformat(
            next_event_container.find(attrs={"itemprop": "endDate"})["content"]
        )
        event_link = next_event_container.find("a", attrs={"class": "btn-event-link"})[
            "href"
        ]
        self.log.info(f"Creating the event {event_name}")
        return Event(
            begin=start_time,
            end=end_time,
            name=f"ONE: {event_name}",
            description=event_description,
            url=event_link,
        )

    def get_all_events(self) -> List[Event]:
        upcoming_events = self.soup.find(attrs={"class", "upcoming-events"})
        event_containers = upcoming_events.find_all(attrs={"class", "event"})
        self.log.info(f"Retrieved {len(event_containers)} other events")
        return [
            Event(
                begin=datetime.fromisoformat(
                    event.find(attrs={"itemprop": "startDate"})["content"]
                ),
                end=datetime.fromisoformat(
                    event.find(attrs={"itemprop": "endDate"})["content"]
                ),
                name=event.find(attrs={"itemprop": "name"}).text,
                description="Coming soon...",
                url=event.find("a", attrs={"itemprop": "url"})["href"],
            )
            for event in event_containers
        ]

    def time_to_update(self) -> bool:
        if not self.last_update:
            return True
        time_difference = datetime.now(tz=UTC) - self.last_update
        if time_difference.seconds > 86400:
            return True
        self.log.info(f"Last update was {self.last_update.astimezone(PST)}")

    def update_calendar(self):
        file_path = Path(__file__).parent.resolve() / "data/onefc.ics"
        if not self.time_to_update():
            return file_path
        self.log.info("Starting calendar update")
        self.event_calendar.events.clear()
        self.event_calendar.events.add(self.get_next_event())
        for event in self.get_all_events():
            self.event_calendar.events.add(event)
        with open(file_path, "w") as calendar_file:
            calendar_file.writelines(self.event_calendar)
        self.log.info(
            f"Writing out {len(self.event_calendar.events)} events on calendar to {file_path}"
        )
        self.last_update = datetime.now(tz=UTC)
        return file_path


if __name__ in "__main__":
    c = CalendarControl()
    c.update_calendar()
