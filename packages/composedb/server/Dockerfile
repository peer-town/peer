FROM node:16 AS builder
RUN apt update && apt install git python3 make build-essential openssl -y
WORKDIR /app
RUN npm install yarn turbo pnpm node-gyp secp256k1 -g
COPY . .
RUN yarn
EXPOSE 7008
CMD ["yarn","composedb:server:docker"]