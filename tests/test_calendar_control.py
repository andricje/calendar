from pathlib import PosixPath
from onechampcalendar.calendar_control import CalendarControl
from ics import Event


def setup_module(module):
    print("*****SETUP*****")


def teardown_module(module):
    print("*****TEARDOWN*****")


def test_get_event_links(calendar_control: CalendarControl):
    event_links = calendar_control.get_event_links()
    for event in event_links:
        assert "https://www.onefc.com" in event


def test_get_event_from_url(calendar_control: CalendarControl):
    event_links = calendar_control.get_event_links()
    for link in event_links:
        event = calendar_control.get_event_from_url(link)
        assert event
        assert type(event) == Event
        assert event.begin
        assert event.end
        assert event.name
        assert event.description
        assert event.url


def test_get_events_page(calendar_control: CalendarControl):
    assert calendar_control.get_events_page()
    assert type(calendar_control.get_events_page()) == str


def test_update_calendar(calendar_control: CalendarControl):
    file_path = calendar_control.update_calendar()
    assert file_path
    assert type(file_path) == PosixPath
    assert file_path.exists()
