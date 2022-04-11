import requests
import pytz
import os
from typing import List
from datetime import datetime
from bs4 import BeautifulSoup
from calendar_event import CalendarEvent
from ics import Calendar, Event
from flask import Flask, send_file, redirect

app = Flask(__name__)
PST = pytz.timezone("US/Pacific")
UTC = pytz.utc


def get_events_page():
    raw_events_page = requests.get("https://www.onefc.com/events/")
    return raw_events_page.text


soup = BeautifulSoup(get_events_page(), features="html.parser")
event_calendar = Calendar()
all_events: List[CalendarEvent] = []


def get_next_event():
    next_event_container = soup.find(id="event-banner")
    event_name = next_event_container.find(attrs={"itemprop": "name"})["content"]
    event_description = next_event_container.find(attrs={"itemprop": "description"})[
        "content"
    ]
    start_time = datetime.fromisoformat(
        next_event_container.find(attrs={"itemprop": "startDate"})["content"]
    )
    end_time = datetime.fromisoformat(
        next_event_container.find(attrs={"itemprop": "endDate"})["content"]
    )
    event_link = next_event_container.find("a", attrs={"class": "btn-event-link"})[
        "href"
    ]
    all_events.append(
        CalendarEvent(
            start_time=start_time,
            end_time=end_time,
            title=event_name,
            description=event_description,
            url=event_link,
        )
    )


def get_all_events():
    upcoming_events = soup.find(attrs={"class", "upcoming-events"})
    event_containers = upcoming_events.find_all(attrs={"class", "event"})
    for event in event_containers:
        event_name = event.find(attrs={"itemprop": "name"}).text
        start_time = datetime.fromisoformat(
            event.find(attrs={"itemprop": "startDate"})["content"]
        )
        end_time = datetime.fromisoformat(
            event.find(attrs={"itemprop": "endDate"})["content"]
        )
        event_link = event.find("a", attrs={"itemprop": "url"})["href"]
        all_events.append(
            CalendarEvent(
                start_time=start_time,
                end_time=end_time,
                title=event_name,
                description="Coming soon...",
                url=event_link,
            )
        )


get_next_event()
get_all_events()


def build_ics_file(calendar_event: CalendarEvent, timezone):
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
    event_calendar.events.add(event)


for event in all_events:
    build_ics_file(event, UTC)


with open("onefc.ics", "w") as calendar_file:
    calendar_file.writelines(event_calendar)

@app.route("/onefccalendar")
def direct_calendar_url():
    return send_file("../onefc.ics")

@app.route("/subscribe")
def subscribe_to_calendar():
    return redirect("webcal://localhost:5000/onefccalendar")


if __name__ == "__main__":
    app.run(debug=True)
