from calendar_control import CalendarControl
from flask import Flask, send_file, redirect, render_template

calendar_manager = CalendarControl()
app = Flask(__name__)


@app.route("/onefccalendar")
def direct_calendar_url():
    file_path = calendar_manager.update_calendar()
    return send_file(file_path)


@app.route("/subscribe/apple")
def subscribe_to_calendar_apple():
    return redirect("webcal://onefccalendar.com/onefccalendar")


@app.route("/subscribe/google")
def subscribe_to_calendar_google():
    return redirect(
        "https://calendar.google.com/calendar/r?cid=https://onefccalendar.com/onefccalendar"
    )


@app.route("/")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
