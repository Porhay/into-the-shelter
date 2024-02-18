FROM python:3.9
WORKDIR /usr/src/shelter-ml
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY . .
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8008"]