import requests
import pytz
from typing import List
from datetime import datetime
from bs4 import BeautifulSoup
from calendar_event import CalendarEvent
from ics import Calendar, Event
from pathlib import Path

UTC = pytz.utc


class CalendarControl:
    def __init__(self) -> None:
        self.soup = BeautifulSoup(self.get_events_page(), features="html.parser")
        self.event_calendar = Calendar()
        self.all_events: List[CalendarEvent] = []

    def get_events_page(self) -> str:
        raw_events_page = requests.get("https://www.onefc.com/events/")
        return raw_events_page.text

    def get_next_event(self) -> CalendarEvent:
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
        return CalendarEvent(
            start_time=start_time,
            end_time=end_time,
            title=event_name,
            description=event_description,
            url=event_link,
        )

    def get_all_events(self) -> List[CalendarEvent]:
        upcoming_events = self.soup.find(attrs={"class", "upcoming-events"})
        event_containers = upcoming_events.find_all(attrs={"class", "event"})
        return [
            CalendarEvent(
                start_time=datetime.fromisoformat(
                    event.find(attrs={"itemprop": "startDate"})["content"]
                ),
                end_time=datetime.fromisoformat(
                    event.find(attrs={"itemprop": "endDate"})["content"]
                ),
                title=event.find(attrs={"itemprop": "name"}).text,
                description="Coming soon...",
                url=event.find("a", attrs={"itemprop": "url"})["href"],
            )
            for event in event_containers
        ]

    def add_event_to_calendar(self, calendar_event: CalendarEvent, timezone=UTC):
        event = Event()
        event.name = calendar_event.title
        event.description = calendar_event.description
        event.url = calendar_event.url
        event.begin = calendar_event.start_time.astimezone(timezone).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        event.end = calendar_event.end_time.astimezone(timezone).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        self.event_calendar.events.add(event)

    def update_calendar(self):
        file_path = Path(__file__).parent.resolve() / "data/onefc.ics"
        self.event_calendar.events.clear()
        self.add_event_to_calendar(self.get_next_event())
        for event in self.get_all_events():
            self.add_event_to_calendar(event)
        with open(file_path, "w") as calendar_file:
            calendar_file.writelines(self.event_calendar)
        return file_path


if __name__ in "__main__":
    c = CalendarControl()
    c.update_calendar()
