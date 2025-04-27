import pytest

from mmacalendar.calendar_control import OneFcCalendar, UfcCalendar
from mmacalendar.main import app


@pytest.fixture(scope="session")
def flask_app():
    app.config.update({"TESTING": True})
    yield app


@pytest.fixture()
def client(flask_app):
    return flask_app.test_client()


@pytest.fixture()
def runner(flask_app):
    return flask_app.test_cli_runner()


@pytest.fixture(scope="session")
def one_fc() -> OneFcCalendar:
    one_fc = OneFcCalendar()
    return one_fc


@pytest.fixture(scope="session")
def ufc() -> UfcCalendar:
    ufc = UfcCalendar()
    return ufc
