FROM node:16

EXPOSE 80
WORKDIR /usr/app/src

COPY .env ./
COPY ./src ./
COPY package*.json ./
RUN npm install pm2 -g
RUN npm install

CMD [ "pm2-runtime", "index.js" ]
