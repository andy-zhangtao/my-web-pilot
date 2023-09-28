FROM node:alpine3.17
RUN apk update && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libstdc++ 
RUN mkdir my-web-pilot
WORKDIR /my-web-pilot
RUN npm install puppeteer

