FROM node:19-alpine

WORKDIR /root

COPY package.json /root
COPY package-lock.json /root

RUN npm ci
RUN npm install -g pm2

COPY . /root
