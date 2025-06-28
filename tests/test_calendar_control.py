from pathlib import PosixPath
import time

from ics import Event

from mmacalendar.calendar_control import OneFcCalendar, UfcCalendar


def test_check_for_duplicate_event_ufc(ufc: UfcCalendar):
    for _ in range(3):
        before_update = [event.name for event in ufc.event_calendar.events]
        ufc.last_update = None
        ufc.update_calendar()
        after_update = [event.name for event in ufc.event_calendar.events]
        assert (
            before_update.sort() == after_update.sort()
        ), f"The UFC calendar does not match from initial creation, to a follow up scan from the site.\nBefore update: {before_update.sort()}\nAfter update: {after_update.sort()}"
        time.sleep(3)


def test_check_for_duplicate_event_one_fc(one_fc: OneFcCalendar):
    for _ in range(3):
        before_update = [event.name for event in one_fc.event_calendar.events]
        one_fc.last_update = None
        one_fc.update_calendar()
        after_update = [event.name for event in one_fc.event_calendar.events]
        assert (
            before_update.sort() == after_update.sort()
        ), f"The One FC calendar does not match from initial creation, to a follow up scan from the site.\nBefore update: {before_update.sort()}\nAfter update: {after_update.sort()}"
        time.sleep(3)


def test_get_event_links_onefc(one_fc: OneFcCalendar):
    event_links = one_fc.get_event_links()
    assert event_links, "No event links were located."
    for event in event_links:
        assert "https://www.onefc.com" in event


def test_get_event_from_url_onefc(one_fc: OneFcCalendar):
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


def test_update_calendar_onefc(one_fc: OneFcCalendar):
    file_path = one_fc.update_calendar()
    assert file_path
    assert isinstance(file_path, PosixPath)
    assert file_path.exists()


def test_get_event_links_ufc(ufc: UfcCalendar):
    event_links = ufc.get_event_links()
    assert event_links, "No event links were located."
    for event in event_links:
        assert "https://www.ufc.com" in event


def test_get_event_from_url_ufc(ufc: UfcCalendar):
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


def test_update_calendar_ufc(ufc: UfcCalendar):
    file_path = ufc.update_calendar()
    assert ufc.event_calendar.events, "Event calendar is empty."
    assert file_path
    assert isinstance(file_path, PosixPath)
    assert file_path.exists()
