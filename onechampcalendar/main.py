from calendar_control import CalendarControl
from flask import Flask, send_file, redirect

calendar_manager = CalendarControl()
app = Flask(__name__)


@app.route("/onefccalendar")
def direct_calendar_url():
    file_path = calendar_manager.update_calendar()
    return send_file(file_path)


@app.route("/subscribe")
def subscribe_to_calendar():
    return redirect("webcal://localhost:5000/onefccalendar")


if __name__ == "__main__":
    app.run(debug=True)
