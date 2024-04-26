FROM node:18-alpine
WORKDIR /usr/app

COPY .env ./
COPY ./app.sh ./
RUN chmod +x ./app.sh
COPY ./src ./src
COPY package*.json .
RUN npm install pm2 -g --force
RUN npm install --force

CMD ./app.sh
