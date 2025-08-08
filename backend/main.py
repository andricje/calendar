"""A simple Flask backend to route traffic"""

import os

from backend.onefc_calendar import OneFcCalendar
from backend.ufc_calendar import UfcCalendar
from flask import Flask, redirect, send_file, request

one_fc_calendar = OneFcCalendar()
ufc_calendar = UfcCalendar()
app: Flask = Flask(__name__)
url = os.getenv("URL") if os.getenv("URL") else "mmacalendars.com"


@app.route("/onefccalendar")
def direct_ofc_url():
    """Send ICS file to client"""
    file_path = one_fc_calendar.update_calendar()
    if "onefccalendar" in request.host:
        file_path = one_fc_calendar.add_ofc_domain_expiration(file_path)
    return send_file(file_path)


@app.route("/ufc")
def direct_ufc_url():
    """Send UFC ICS file to client"""
    file_path = ufc_calendar.update_calendar()
    if "onefccalendar" in request.host:
        file_path = one_fc_calendar.add_ofc_domain_expiration(file_path)
    return send_file(file_path)


@app.route("/ufc/apple")
def subscribe_to_ufc_calendar():
    """Open subscription link for native calendar apps"""
    return redirect(f"webcal://{url}/ufc")


@app.route("/ufc/google")
def subscribe_to_ufc_google_calendar():
    """Open subscription link for native calendar apps"""
    return redirect(f"https://calendar.google.com/calendar/r?cid=http://{url}/ufc")


@app.route("/onefc/apple")
def subscribe_to_calendar_apple():
    """Open subscription link for native calendar apps"""
    return redirect(f"webcal://{url}/onefccalendar")


@app.route("/onefc/google")
def subscribe_to_calendar_google():
    """Open subscription link in Google Calendar"""
    return redirect(
        f"https://calendar.google.com/calendar/r?cid=http://{url}/onefccalendar"
    )


@app.route("/")
def home():
    """Return simple JSON response for API health check"""
    return {
        "status": "ok",
        "message": "Sports Calendar Backend API",
        "endpoints": {
            "ufc": "/ufc",
            "onefc": "/onefccalendar"
        }
    }


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5001)
