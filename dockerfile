FROM node:lts-slim
WORKDIR /app 
COPY . .
RUN touch events.json
RUN touch users.json
CMD node server.js