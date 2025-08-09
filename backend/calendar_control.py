# pylint: disable=missing-timeout,logging-fstring-interpolation,missing-module-docstring
import logging
import sys
from abc import ABCMeta, abstractmethod
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any

import pytz
from ics import Calendar, Event
import os
import json

logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


class CacheManager:
    def __init__(self):
        self.data_dir = Path("data")
        self.data_dir.mkdir(exist_ok=True)
        self.cache_file = self.data_dir / "cache_info.json"
        self.stats_file = self.data_dir / "scraping_stats.json"

    # ---- stats helpers (per-service) ----
    def _default_service_stats(self) -> Dict[str, Any]:
        return {
            "daily_results": {},
            "success_rate_30d": 0,
            "total_attempts_30d": 0,
            "total_success_30d": 0,
            "daily_success_array": [],
            "last_update": None,
            "last_events_count": 0,
        }

    def _load_all_stats(self) -> Dict[str, Any]:
        """Load stats file and normalize to { services: { ufc|onefc|backend: ... } }"""
        if self.stats_file.exists():
            try:
                with open(self.stats_file, 'r') as f:
                    data = json.load(f)
                # Normalize legacy flat shape
                if "services" not in data:
                    legacy = {
                        "daily_results": data.get("daily_results", {}),
                        "success_rate_30d": data.get("success_rate_30d", 0),
                        "total_attempts_30d": data.get("total_attempts_30d", 0),
                        "total_success_30d": data.get("total_success_30d", 0),
                        "daily_success_array": data.get("daily_success_array", []),
                        "last_update": data.get("last_update"),
                        "last_events_count": data.get("last_events_count", 0),
                    }
                    data = {"services": {"backend": {**self._default_service_stats(), **legacy}}}
                # Ensure all known services exist
                services = data.get("services", {})
                for key in ("ufc", "onefc", "backend"):
                    if key not in services:
                        services[key] = self._default_service_stats()
                data["services"] = services
                return data
            except Exception:
                pass
        # Default fresh structure
        return {
            "services": {
                "ufc": self._default_service_stats(),
                "onefc": self._default_service_stats(),
                "backend": self._default_service_stats(),
            }
        }

    def _save_all_stats(self, data: Dict[str, Any]) -> None:
        with open(self.stats_file, 'w') as f:
            json.dump(data, f)
        
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
        
        # Update backend heartbeat in stats
        try:
            self.update_service_stats("backend", status == "success")
        except Exception:
            pass
    
    def update_scraping_stats(self, success: bool):
        """Legacy method: update backend service stats."""
        self.update_service_stats("backend", success)

    def update_service_stats(self, service: str, success: bool, events_count: int | None = None) -> None:
        """Update 30-day stats for a given service (ufc, onefc, backend)."""
        data = self._load_all_stats()
        stats = data["services"].get(service, self._default_service_stats())

        today = datetime.now().strftime("%Y-%m-%d")
        if today not in stats["daily_results"]:
            stats["daily_results"][today] = {"success": 0, "failed": 0}
        if success:
            stats["daily_results"][today]["success"] += 1
        else:
            stats["daily_results"][today]["failed"] += 1

        # Trim >30 days
        cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        stats["daily_results"] = {d: v for d, v in stats["daily_results"].items() if d >= cutoff}

        # Recompute aggregates
        total_attempts = sum(v["success"] + v["failed"] for v in stats["daily_results"].values())
        total_success = sum(v["success"] for v in stats["daily_results"].values())
        stats["success_rate_30d"] = (total_success / total_attempts * 100) if total_attempts else 0
        stats["total_attempts_30d"] = total_attempts
        stats["total_success_30d"] = total_success

        # Rebuild daily_success_array
        daily = []
        for i in range(30):
            date = (datetime.now() - timedelta(days=29 - i)).strftime("%Y-%m-%d")
            if date in stats["daily_results"]:
                dr = stats["daily_results"][date]
                success_day = dr["success"] > dr["failed"]
            else:
                success_day = False
            daily.append({"date": date, "success": success_day})
        stats["daily_success_array"] = daily

        stats["last_update"] = datetime.now().isoformat()
        if events_count is not None:
            stats["last_events_count"] = events_count

        data["services"][service] = stats
        self._save_all_stats(data)
    
    def get_scraping_stats(self) -> Dict[str, Any]:
        """Return stats for all services."""
        return self._load_all_stats()
    
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
        if self.stats_file.exists():
            self.stats_file.unlink()


# Shared global instance
global_cache_manager = CacheManager()


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
