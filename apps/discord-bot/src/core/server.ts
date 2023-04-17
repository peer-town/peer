import express, {Express} from "express";
import cors from "cors";
import {config} from "../config";
import * as commentHandler from "./comments/handler";
import * as threadHandler from "./threads/handler";
import {Client, GatewayIntentBits, Partials} from "discord.js";
import {commentSchema, threadSchema, validator} from "./middleware/validator";
import {Clients} from "./types";
import {logger} from "./utils/logger";
import {apiKeyAuth} from "./middleware/auth";

process.on("uncaughtException", (error, origin) => {
  console.log(error);
  logger.error('core', {error, origin});
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('core', {reason, promise});
});

export const initServer = (clients: Clients): Express => {
  const server = express();
  server.use(cors());
  server.use(express.urlencoded({extended: true}));
  server.use(express.json());
  server.use(apiKeyAuth(config.server.apiKey));

  const router = express.Router();
  router.get("/ping", (_, res) => res.send("pong"));
  router.post("/web-comment", validator(commentSchema), (req, res) => commentHandler.postComment(clients, req, res));
  router.post("/web-thread", validator(threadSchema), (req, res) =>  threadHandler.postThread(clients, req, res));
  server.use("/api", router);

  return server;
};

export const initDiscord = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [Partials.Channel],
  });
  await client.login(config.discord.token);
  return client;
}
