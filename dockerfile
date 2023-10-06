FROM node:20.8.0-bullseye-slim
RUN apt update && \
    apt install -y vim \
    chromium
RUN npm install -g puppeteer
RUN useradd -m pilot
USER pilot


