FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb://192.168.1.8:27017/flightReservation
ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=192.168.1.8

EXPOSE 5000

CMD ["npm", "start"]