FROM python:3.11-slim

WORKDIR /app

# Copy source code first
COPY backend/ ./backend/
COPY tests/ ./tests/
COPY pyproject.toml uv.lock README.md ./

# Install dependencies
RUN pip install uv && uv sync --frozen

EXPOSE 5000

# Run the application
CMD ["uv", "run", "python", "-m", "backend.main"]