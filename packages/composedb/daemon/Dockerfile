FROM node:16 AS builder
RUN apt update && apt install git python3 make build-essential openssl -y
WORKDIR /app
RUN yarn global add turbo pnpm node-gyp secp256k1
COPY . .
EXPOSE 7007
CMD ["yarn","composedb:daemon"]