"""Sports Calendar Backend

A Flask backend for serving sports calendar ICS files.
"""

__version__ = "1.0.0"

from .onefc_calendar import OneFcCalendar
from .ufc_calendar import UfcCalendar

__all__ = ["OneFcCalendar", "UfcCalendar"]
