FROM node:12-alpine

WORKDIR /app

VOLUME /data

COPY ./server.js server.js
COPY ./public public
COPY ./views views
COPY ./package-lock.json package-lock.json
COPY ./package.json package.json

RUN npm ci

ENV PORT 3000

EXPOSE 3000
CMD [ "npm", "run", "start" ]
