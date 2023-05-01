FROM node:18
WORKDIR /usr/app

COPY .env ./
COPY ./app.sh ./
RUN chmod +x ./app.sh
COPY ./src ./src
COPY package*.json .
RUN npm install pm2 -g
RUN npm install

RUN ./app.sh
