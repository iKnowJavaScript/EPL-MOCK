FROM node:latest

USER root

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn  

COPY . .

RUN ls -la

EXPOSE 6060

CMD [ "yarn", "start:dev" ] 