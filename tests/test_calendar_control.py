from pathlib import PosixPath
from onechampcalendar.calendar_control import CalendarControl
from ics import Event


def setup_module(module):
    print("*****SETUP*****")


def teardown_module(module):
    print("*****TEARDOWN*****")


def test_get_events_page(calendar_control: CalendarControl):
    assert calendar_control.get_events_page()
    assert type(calendar_control.get_events_page()) == str


def test_get_next_event(calendar_control: CalendarControl):
    next_event = calendar_control.get_next_event()
    assert next_event
    assert type(next_event) == Event
    assert next_event.begin
    assert next_event.end
    assert next_event.name
    assert next_event.description
    assert next_event.url


def test_get_all_events(calendar_control: CalendarControl):
    all_events = calendar_control.get_all_events()
    assert all_events
    assert type(all_events) == list
    for event in all_events:
        assert type(event) == Event
        assert event.begin
        assert event.end
        assert event.name
        assert event.description
        assert event.url


def test_update_calendar(calendar_control: CalendarControl):
    file_path = calendar_control.update_calendar()
    assert file_path
    assert type(file_path) == PosixPath
    assert file_path.exists()
