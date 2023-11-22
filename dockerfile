FROM node:lts-slim
WORKDIR /app 
COPY . .
RUN touch events.json
RUN touch users.json
RUN npm install
CMD node server.js