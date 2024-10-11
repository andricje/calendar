FROM python:3.13-slim as builder
RUN pip install poetry
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --without dev && rm -rf ${POETRY_CACHE_DIR}

# Slim Runtime layer
FROM python:3.13-alpine as runtime
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"
COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY mmacalendar /app
WORKDIR /app
CMD ["gunicorn", "--bind", ":5000", "--log-level", "debug", "--workers", "2", "wsgi:app"]