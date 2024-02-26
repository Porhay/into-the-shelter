# FROM python:3.9
# WORKDIR /usr/src/shelter-ml
# COPY ./requirements.txt ./requirements.txt
# RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
# COPY . .
# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8008"]

FROM python:3.9-slim

WORKDIR /usr/src/shelter-ml

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt && \
    apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg libsm6 libxext6 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8008"]