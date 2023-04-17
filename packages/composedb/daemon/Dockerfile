FROM node:16 AS builder
RUN apt update && apt install git python3 make build-essential openssl -y
WORKDIR /app
RUN npm install turbo -g
COPY . .
RUN yarn
EXPOSE 7007
CMD ["yarn","composedb:daemon"]