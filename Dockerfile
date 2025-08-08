FROM python:3.11-slim

# Build argument for cache busting
ARG BUILD_DATE=unknown
ARG VCS_REF=unknown

WORKDIR /app

# Copy source code first
COPY backend/ ./backend/
COPY tests/ ./tests/
COPY pyproject.toml uv.lock README.md ./

# Install dependencies (cache busting)
RUN pip install uv && uv sync --frozen

# Expose port (Koyeb će setovati PORT env var)
EXPOSE $PORT

# Run the application
CMD ["uv", "run", "python", "-m", "backend.main"]