import pytest


def test_get_home_page(client):
    response = client.get("/")
    assert (
        b"Subscribe to the unofficial calendars of MMA organizations" in response.data
    ), "Expected text on home page did not load"


def test_google_subscribe(client):
    response = client.get("/onefc/google")
    assert "google.com" in response.location, (
        f"The One FC Google calendar link to not redirect to a google domain. Redirected to {response.location}"
    )
    response = client.get("/ufc/google")
    assert "google.com" in response.location, (
        f"The UFC Google calendar link to not redirect to a google domain. Redirected to {response.location}"
    )


def test_webcal_subscribe(client):
    response = client.get("/onefc/apple")
    assert "webcal" in response.location, (
        f"The webcal/Apple endpoint for One FC did not redirect to a webcal location. Redirected to {response.location}"
    )
    response = client.get("/ufc/apple")
    assert "webcal" in response.location, (
        f"The webcal/Apple endpoint for UFC did not redirect to a webcal location. Redirected to {response.location}"
    )


def test_direct_link(client):
    response = client.get("/ufc")
    assert response.status_code == 200, (
        f"UFC calendar direct link returned {response.status_code}"
    )
    assert b"BEGIN:VCALENDAR" in response.data, "UFC direct calendar link did not contain calendar data."
    response = client.get("/onefccalendar")
    assert response.status_code == 200, (
        f"One FC calendar direct link returned {response.status_code}"
    )
    assert b"BEGIN:VCALENDAR" in response.data, "One FC direct calendar link did not contain calendar data."
