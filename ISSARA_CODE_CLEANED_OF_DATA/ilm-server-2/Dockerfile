FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN python3 -m venv /code/env
RUN /code/env/bin/pip install -r requirements.txt
COPY . /code/


CMD ["/code/env/bin/python3", "manage.py", "runserver", "0.0.0.0:8080"]
