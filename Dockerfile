# FROM node:chakracore
# FROM node:10.13-alpine

# WORKDIR /usr/src/workdir/sterling-premier-league-mock

# COPY ./ ./
# RUN npm install


# EXPOSE 6060

# CMD ["/bin/bash"]
# CMD npm start:dev 


# FROM node:10.16.3-alpine
FROM node:chakracore

USER root
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install
COPY . /usr/src/app
COPY ./ ./
RUN ls -la
EXPOSE 4000
CMD [ "yarn", "start" ] 
# CMD ["bin/bash"]