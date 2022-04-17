import pytest

from onechampcalendar.calendar_control import CalendarControl


@pytest.fixture(scope="session")
def calendar_control():
    calendar_control = CalendarControl()
    return calendar_control
