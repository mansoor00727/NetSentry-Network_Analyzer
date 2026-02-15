FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*


# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
# Copy app code
COPY src/ ./src/
# COPY .env . # .env will be mounted or passed via docker-compose

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check removed (Cloud Run uses its own)


# Run app
CMD sh -c "uvicorn src.api:app --host 0.0.0.0 --port ${PORT:-8000}"
# CMD sh -c "uvicorn src.diagnostic:app --host 0.0.0.0 --port ${PORT:-8000}"
