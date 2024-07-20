from pathlib import PosixPath

from ics import Event

from mmacalendar.calendar_control import CalendarControl


def setup_module(module):
    print("*****SETUP*****")


def teardown_module(module):
    print("*****TEARDOWN*****")


def test_get_event_links_onefc(one_fc: CalendarControl):
    event_links = one_fc.get_event_links()
    assert event_links, "No event links were located."
    for event in event_links:
        assert "https://www.onefc.com" in event


def test_get_event_from_url_onefc(one_fc: CalendarControl):
    event_links = one_fc.get_event_links()
    assert event_links, "No event links were located."
    for link in event_links:
        event = one_fc.get_event_from_url(link)
        assert event
        assert isinstance(event, Event)
        assert event.begin
        assert event.end
        assert event.name
        assert event.description
        assert event.url


def test_update_calendar_onefc(one_fc: CalendarControl):
    file_path = one_fc.update_calendar()
    assert file_path
    assert isinstance(file_path, PosixPath)
    assert file_path.exists()


def test_get_event_links_ufc(ufc: CalendarControl):
    event_links = ufc.get_event_links()
    assert event_links, "No event links were located."
    for event in event_links:
        assert "https://www.ufc.com" in event


def test_get_event_from_url_ufc(ufc: CalendarControl):
    event_links = ufc.get_event_links()
    assert event_links, "No event links were located."
    for link in event_links:
        events = ufc.get_events_from_url(link)
        for event in events:
            assert event
            assert isinstance(event, Event)
            assert event.begin
            assert event.end
            assert event.name
            assert event.description
            assert event.url


def test_update_calendar_ufc(ufc: CalendarControl):
    file_path = ufc.update_calendar()
    assert file_path
    assert isinstance(file_path, PosixPath)
    assert file_path.exists()
