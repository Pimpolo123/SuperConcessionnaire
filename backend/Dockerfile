FROM node:lts-alpine
RUN mkdir -p ../pictures
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start"]