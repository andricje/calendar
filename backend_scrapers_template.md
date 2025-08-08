# Backend Scrapers Template

## Kako dodati novi scraper

### 1. Kreiraj novi scraper fajl
```python
# mmacalendar/scrapers/new_league_scraper.py

from pathlib import Path
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from ..calendar_control import CalendarControl, Event

class NewLeagueScraper(CalendarControl):
    """Scraper for New League events"""
    
    def __init__(self):
        super().__init__()
        self.league_name = "New League"
        self.base_url = "https://example.com"
        
    def get_event_links(self) -> list[str]:
        """Get all event links from the league website"""
        # Implement scraping logic here
        pass
        
    def get_event_from_url(self, url: str) -> Event:
        """Extract event data from individual event page"""
        # Implement event parsing logic here
        pass
        
    def update_calendar(self) -> Path:
        """Update the calendar file"""
        # Standard implementation from CalendarControl
        pass
```

### 2. Dodaj u main.py
```python
# mmacalendar/main.py

from .scrapers.new_league_scraper import NewLeagueScraper

# Initialize scraper
new_league_scraper = NewLeagueScraper()

@app.route("/newleague")
def new_league_calendar():
    """Serve New League calendar"""
    file_path = new_league_scraper.update_calendar()
    return send_file(file_path)
```

### 3. Ažuriraj frontend konfiguraciju
```typescript
// frontend/src/lib/sports-config.ts

{
  id: 'new-league',
  name: 'New League', 
  href: '/newleague',
  backendEndpoint: '/newleague',
  description: 'New League events'
}
```

## Struktura za različite sportove

### Football Scrapers
- Premier League: `premier_league_scraper.py`
- La Liga: `la_liga_scraper.py`
- Serie A: `serie_a_scraper.py`

### Basketball Scrapers  
- NBA: `nba_scraper.py`
- EuroLeague: `euroleague_scraper.py`

### Tennis Scrapers
- ATP: `atp_scraper.py`
- WTA: `wta_scraper.py`

### Formula 1 Scrapers
- F1: `f1_scraper.py`

### eSports Scrapers
- CS2: `cs2_scraper.py`
- LoL: `lol_scraper.py`

## Zajedničke funkcije

### CalendarControl base class
```python
class CalendarControl:
    def get_last_updated_string(self) -> str
    def time_to_update(self) -> bool
    def update_existing_event(self, event: Event)
    def update_calendar(self) -> Path
```

### Event model
```python
class Event:
    name: str
    description: str
    begin: datetime
    end: datetime
    url: str
```

## Best Practices

1. **Error Handling**: Uvek dodaj try/catch blokove
2. **Rate Limiting**: Dodaj delays između requests
3. **User Agents**: Koristi realistic user agents
4. **Caching**: Implementiraj caching za performance
5. **Logging**: Dodaj detaljno logovanje
6. **Testing**: Napravi testove za svaki scraper
