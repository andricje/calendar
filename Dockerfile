FROM python:3.8-alpine
ADD ./onechampcalendar /app
WORKDIR /app
RUN pip install -r Requirements.txt
CMD ["python", "/app/main.py"]
