# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 9090

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9090"]