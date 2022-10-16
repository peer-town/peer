FROM node:16-slim AS builder
RUN apt update && apt install git python3 make build-essential -y
WORKDIR /app
RUN yarn global add turbo pnpm
COPY . .
RUN turbo prune --scope=@devnode/composedb --docker
RUN yarn install --frozen-lockfile
EXPOSE 7007
CMD ["yarn","composedb:daemon"]