# 🚀 Production Deployment Guide

## Backend (Koyeb)

### 1. Deploy to Koyeb
```bash
# Install Koyeb CLI
curl -fsSL https://cli.koyeb.com/install.sh | bash

# Login to Koyeb
koyeb login

# Deploy backend
koyeb app init sports-calendar-backend \
  --docker . \
  --ports 8080:http \
  --env PORT=8080 \
  --env URL=sports-calendar-backend-andricje.koyeb.app \
  --routes /:8080
```

### 2. Environment Variables
- `PORT=8080` - Koyeb port
- `URL=sports-calendar-backend-andricje.koyeb.app` - Backend URL

### 3. Health Check
- Path: `/`
- Port: `8080`
- Interval: `30s`
- Timeout: `10s`
- Retries: `3`

## Frontend (Vercel)

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

### 2. Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_BACKEND_URL=https://sports-calendar-backend-andricje.koyeb.app`

### 3. Custom Domain (Optional)
- Add custom domain in Vercel dashboard
- Configure DNS records

## Local Production Testing

### 1. Build and Run Backend
```bash
# Build Docker image
docker build -t sports-calendar-backend .

# Run with production config
docker run -p 5000:5000 \
  -e PORT=5000 \
  -e URL=sports-calendar-backend-andricje.koyeb.app \
  sports-calendar-backend
```

### 2. Test Backend
```bash
# Health check
curl http://localhost:5000/

# UFC calendar
curl http://localhost:5000/ufc

# ONE FC calendar
curl http://localhost:5000/onefccalendar
```

### 3. Test Frontend
```bash
# Set environment variable
export NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Run frontend
cd frontend
npm run dev
```

## Monitoring

### 1. Backend Logs (Koyeb)
```bash
koyeb logs sports-calendar-backend
```

### 2. Frontend Analytics (Vercel)
- View in Vercel dashboard
- Performance monitoring
- Error tracking

### 3. Health Monitoring
- Backend: `https://sports-calendar-backend-andricje.koyeb.app/`
- Frontend: Vercel dashboard

## Troubleshooting

### Backend Issues
1. Check Koyeb logs: `koyeb logs sports-calendar-backend`
2. Verify environment variables
3. Test health check endpoint
4. Check Docker build logs

### Frontend Issues
1. Check Vercel build logs
2. Verify environment variables
3. Test API routes locally
4. Check browser console for errors

### Common Issues
- **CORS errors**: Backend needs proper CORS headers
- **404 errors**: Check API routes and backend endpoints
- **Build failures**: Check TypeScript errors and dependencies
