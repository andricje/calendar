import pytest

from mmacalendar.calendar_control import OneFcCalendar


@pytest.fixture(scope="session")
def calendar_control():
    calendar_control = OneFcCalendar()
    return calendar_control
