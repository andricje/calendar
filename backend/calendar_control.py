# pylint: disable=missing-timeout,logging-fstring-interpolation,missing-module-docstring
import logging
import sys
from abc import ABCMeta, abstractmethod
from datetime import datetime, timedelta
from pathlib import Path

import pytz
from ics import Calendar, Event
import os
import json

logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


class CalendarControl:
    def __init__(self):
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        self.cache_file = self.data_dir / "cache_info.json"
        
    def get_cache_info(self):
        """Get cache information for monitoring"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {"last_update": None, "status": "no_cache"}
    
    def update_cache_info(self, status="success", error=None):
        """Update cache information"""
        cache_info = {
            "last_update": datetime.now().isoformat(),
            "status": status,
            "error": str(error) if error else None
        }
        with open(self.cache_file, 'w') as f:
            json.dump(cache_info, f)
    
    def is_cache_fresh(self, max_age_hours=24):
        """Check if cache is fresh enough"""
        cache_info = self.get_cache_info()
        if not cache_info.get("last_update"):
            return False
            
        last_update = datetime.fromisoformat(cache_info["last_update"])
        return datetime.now() - last_update < timedelta(hours=max_age_hours)
    
    def clear_cache(self):
        """Clear all cached data"""
        for file in self.data_dir.glob("*.ics"):
            file.unlink()
        if self.cache_file.exists():
            self.cache_file.unlink()


class CalendarControl(metaclass=ABCMeta):
    UTC = pytz.utc
    PST = pytz.timezone("US/Pacific")

    def __init__(self) -> None:
        self.event_calendar = Calendar()
        self.log = logging.getLogger(__name__)
        self.last_update: datetime = None

        try:
            self.update_calendar()
        except Exception as exc:
            self.log.exception(
                f"{self.__class__} failed to initialize. \n\nException: {exc}"
            )

    def get_last_updated_string(self) -> str:
        """Get a nicely formatted string version of the last updated value

        Returns:
            str: String representation for the time adjusted for PST
        """
        if not self.last_update:
            return "Updating now..."
        return self.last_update.astimezone(self.PST).strftime("%Y-%m-%d %H:%M")

    def time_to_update(self) -> bool:
        """Determine if the application should check for event updates

        Returns:
            bool: True if the last check was at least 24 hours ago
        """
        if not self.last_update:
            return True
        time_difference = datetime.now(tz=self.UTC) - self.last_update
        self.log.info(f"Days since last update: {time_difference.days}")
        if time_difference.days:
            return True
        self.log.info(f"Last update was {self.last_update.astimezone(self.PST)}")
        return False

    def update_existing_event(self, event: Event):
        """Update existing event if one is present in the calendar, otherwise create the event.

        Args:
            event (Event): Event to add or update.
        """
        for existing_event in self.event_calendar.events:
            if (
                (event.name == existing_event.name)
                or (
                    event.begin == existing_event.begin
                    and event.end == existing_event.end
                )
                or (
                    event.url == existing_event.url
                    and event.name == existing_event.name
                )
            ):
                self.event_calendar.events.discard(existing_event)
                self.event_calendar.events.add(event)
                return
        self.event_calendar.events.add(event)

    @abstractmethod
    def update_calendar(self) -> Path:
        """Update the calendar file with the latest details

        Returns:
            Path: Calendar file location the serve to the client
        """
