FROM node:16
WORKDIR /usr/app/src

COPY .env ./
COPY ./src ./
COPY package*.json ./

RUN npm install

CMD [ "npm", "run", "start" ]
