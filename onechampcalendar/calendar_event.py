from dataclasses import dataclass
from datetime import datetime


@dataclass
class CalendarEvent:
    start_time: datetime
    end_time: datetime
    title: str
    description: str
    url: str
