"""A simple Flask backend to route traffic"""
from calendar_control import CalendarControl
from flask import Flask, redirect, render_template, send_file

calendar_manager = CalendarControl()
app = Flask(__name__)


@app.route("/onefccalendar")
def direct_calendar_url():
    """Send ICS file to client"""
    file_path = calendar_manager.update_calendar()
    return send_file(file_path)


@app.route("/subscribe/apple")
def subscribe_to_calendar_apple():
    """Open subscription link for native calendar apps"""
    return redirect("webcal://onefccalendar.com/onefccalendar")


@app.route("/subscribe/google")
def subscribe_to_calendar_google():
    """Open subscription link in Google Calendar"""
    return redirect(
        "https://calendar.google.com/calendar/r?cid=http://onefccalendar.com/onefccalendar"
    )


@app.route("/")
def home():
    """Return the home page jinja template"""
    return render_template(
        "home.html",
        last_updated=calendar_manager.get_last_updated_string(),
    )


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5001)
