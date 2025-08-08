# MMA Calendar

A free and open source way to subscribe to calendars from multiple MMA organizations.
 - One Championship calendar. https://www.onefc.com
 - UFC https://www.ufc.com

## Features

- **Modern Web Interface**: Beautiful Next.js frontend with Apple-style design
- **Flask Backend**: Robust API for calendar generation and updates
- **Real-time Updates**: Automatic calendar updates with latest event information
- **Cross-platform**: Works with Apple Calendar, Google Calendar, and more
- **No Tracking**: Privacy-focused with no ads or trackers

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Flask, Python 3.13, Gunicorn
- **Styling**: Apple-inspired design with glass morphism effects
- **Deployment**: Docker & Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/andricje/calendar.git
cd calendar

# Start both frontend and backend
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5001
```

### Manual Setup

#### Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the Flask backend
cd mmacalendar
python main.py
```

#### Frontend
```bash
# Install Node.js dependencies
cd frontend
npm install

# Run the development server
npm run dev
```

## API Endpoints

- `GET /ufc` - UFC calendar (ICS format)
- `GET /onefccalendar` - ONE FC calendar (ICS format)
- `GET /` - Home page with calendar links

## Calendar Subscription Links

### UFC
- Apple Calendar: `webcal://localhost:5001/ufc`
- Google Calendar: `https://calendar.google.com/calendar/r?cid=http://localhost:5001/ufc`

### ONE FC
- Apple Calendar: `webcal://localhost:5001/onefccalendar`
- Google Calendar: `https://calendar.google.com/calendar/r?cid=http://localhost:5001/onefccalendar`

## How it works

- Scrape events page for event details
- Create and publish ics calendar
- Update regularly

## What's the catch?

This sounded like a fun project that I wanted for my own use. Couldn't find a subscribable calendar so I made it myself. There's no strings attached, no trackers, no ads.


## Author

**Marko Andrić** - Computer Science student at the University of Belgrade, passionate about software development, algorithms, and blockchain technology.

- GitHub: [@andricje](https://github.com/andricje)
