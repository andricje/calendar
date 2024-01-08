import pytest

from mmacalendar.calendar_control import OneFcCalendar
from mmacalendar.calendar_control import UfcCalendar


@pytest.fixture(scope="session")
def one_fc():
    one_fc = OneFcCalendar()
    return one_fc


@pytest.fixture(scope="session")
def ufc():
    ufc = UfcCalendar()
    return ufc
