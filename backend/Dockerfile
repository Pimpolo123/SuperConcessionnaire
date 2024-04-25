FROM node:lts-alpine
RUN mkdir -p ../pictures/user
RUN mkdir -p ../pictures/car
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start"]