FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package.json /usr/src/app
RUN npm install --dev

COPY . /usr/src/app
EXPOSE 8080

CMD [ "npm", "start" ]