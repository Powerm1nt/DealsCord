FROM node:18
WORKDIR /usr/app

COPY .env ./
COPY ./src ./
COPY package*.json .
RUN npm install pm2 -g
RUN npm install

CMD [ "pm2-runtime", "src/index.js" ]
