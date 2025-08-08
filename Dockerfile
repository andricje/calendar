FROM python:3.11-slim

# Build argument for cache busting
ARG BUILD_DATE=unknown
ARG VCS_REF=unknown

WORKDIR /app

# Copy source code first
COPY backend/ ./backend/
COPY tests/ ./tests/
COPY pyproject.toml uv.lock README.md ./

# Install dependencies directly with pip
RUN pip install --no-cache-dir \
    flask>=3.0.0 \
    requests>=2.31.0 \
    beautifulsoup4>=4.12.0 \
    ics>=0.7.0 \
    pytz>=2023.3 \
    gunicorn>=21.0.0

# Expose port (default to 8080 for Koyeb)
EXPOSE 8080

# Run with Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "backend.wsgi:app"]