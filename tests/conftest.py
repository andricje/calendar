import pytest

from onechampcalendar.calendar_control import OneFcCalendar


@pytest.fixture(scope="session")
def calendar_control():
    calendar_control = OneFcCalendar()
    return calendar_control
