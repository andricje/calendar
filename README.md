# Sports Calendar

Free and open source way to subscribe to calendars from multiple sports organizations. Never miss a game, fight, or match again.

## Features

- **Multiple Sports**: MMA, Football, Basketball, Tennis, Formula 1, eSports
- **Calendar Subscriptions**: Apple Calendar, Google Calendar, ICS download
- **Real-time Updates**: Automatic calendar updates with caching
- **Modern UI**: Apple-style design with animated backgrounds
- **Responsive**: Works on desktop, tablet, and mobile
- **Open Source**: Free to use and modify

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Vercel** - Hosting

### Backend
- **Python 3.11** - Backend language
- **Flask** - Web framework
- **BeautifulSoup** - Web scraping
- **ICS** - Calendar format
- **Gunicorn** - Production server
- **Koyeb** - Hosting

## Quick Start

### Option 1: Docker Compose (Development)

```bash
# Clone the repository
git clone https://github.com/andricje/calendar.git
cd calendar

# Start with Docker Compose
npm run dev
# or
docker-compose up
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m main

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /` - Health check
- `GET /ufc` - UFC calendar
- `GET /onefccalendar` - ONE Championship calendar
- `GET /cache` - Cache status
- `GET /cache/clear` - Clear cache

## Calendar Subscription Links

### UFC
- **Apple Calendar**: `webcal://backend-url/ufc?name=UFC%20Events`
- **Google Calendar**: `https://calendar.google.com/calendar/r?cid=backend-url/ufc&name=UFC%20Events`
- **Download ICS**: `https://backend-url/ufc?name=UFC%20Events`

### ONE Championship
- **Apple Calendar**: `webcal://backend-url/onefccalendar?name=ONE%20Championship%20Events`
- **Google Calendar**: `https://calendar.google.com/calendar/r?cid=backend-url/onefccalendar&name=ONE%20Championship%20Events`
- **Download ICS**: `https://backend-url/onefccalendar?name=ONE%20Championship%20Events`

## Production Deployment

### Backend (Koyeb)

1. **Deploy to Koyeb**:
```bash
# Install Koyeb CLI
curl -fsSL https://cli.koyeb.com/install.sh | bash

# Login to Koyeb
koyeb login

# Deploy backend
koyeb app init sports-calendar-backend \
  --docker . \
  --ports 8080:http \
  --routes /:8080 \
  --env URL=sports-calendar-backend-andricje.koyeb.app
```

2. **Environment Variables**:
- `URL`: Your Koyeb app URL
- `PORT`: 8080 (default)

### Frontend (Vercel)

1. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

2. **Environment Variables**:
- `NEXT_PUBLIC_BACKEND_URL`: Your Koyeb backend URL (without trailing slash)

### Example URLs

- **Frontend**: https://sports-calendar-andricje.vercel.app
- **Backend**: https://sports-calendar-backend-andricje.koyeb.app

## Development

### Adding New Sports/Leagues

1. **Backend Scraper**:
```python
# backend/new_sport_calendar.py
from backend.calendar_control import CalendarControl

class NewSportCalendar(CalendarControl):
    def update_calendar(self) -> Path:
        # Implement scraping logic
        pass
```

2. **Frontend Config**:
```typescript
// frontend/src/lib/sports-config.ts
{
  key: 'newsport',
  name: 'New Sport',
  icon: NewSportIcon,
  leagues: [
    {
      id: 'newleague',
      name: 'New League',
      href: '/newleague',
      backendEndpoint: '/newleague',
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

- **Original**: [@rsoper](https://github.com/rsoper)
- **Extended**: [@andricje](https://github.com/andricje)
