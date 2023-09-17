FROM python:3.11-alpine
ADD ./onechampcalendar /app
WORKDIR /app
RUN pip install -r Requirements.txt
CMD ["/bin/sh", "/app/run.sh"]