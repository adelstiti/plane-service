FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb+srv://root:flight_password@cluster0.jl56l.mongodb.net/flightReservation?retryWrites=true&w=majority

EXPOSE 5000

CMD ["npm", "start"]