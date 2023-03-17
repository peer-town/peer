import express, {Express} from "express";
import cors from "cors";
import {config} from "../config";
import * as commentHandler from "./comments/handler";
import * as threadHandler from "./threads/handler";
import {Client, GatewayIntentBits, Partials} from "discord.js";
import {commentSchema, validator} from "./middleware/validator";
import {Clients} from "./types";

export const initServer = (clients: Clients): Express => {
  const server = express();
  server.use(cors());
  server.use(express.urlencoded({extended: true}));
  server.use(express.json());

  const router = express.Router();
  router.get("/ping", (_, res) => res.send("pong"));
  router.post("/web-comment", validator(commentSchema), (req, res) => commentHandler.postComment(clients, req, res));
  router.post("/web-thread", threadHandler.postThread);
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
