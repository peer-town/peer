import {initServer} from "./core";
import {config} from "./config";
import {ComposeClient} from "@composedb/client";
import {composeQueryHandler, definition} from "@devnode/composedb";
import {attachListeners} from "./bots/discord";
import {Clients} from "./core/types";
import {Client, GatewayIntentBits, Partials} from "discord.js";
import {Telegraf} from "telegraf";
import {attachTelegramListeners} from "./bots/telegram";

const initDiscord = async () => {
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

const initTelegram = async () => {
  return new Telegraf(config.telegram.token);
}

const start = async () => {
  const discordClient = await initDiscord();
  const telegramClient = await initTelegram();
  const composeClient = new ComposeClient({
    ceramic: config.compose.nodeUrl,
    definition,
  });

  const clients: Clients = {
    discord: discordClient,
    telegraf: telegramClient,
    compose: composeClient,
    composeQuery: composeQueryHandler,
  };

  // const server = initServer(clients);
  // server.listen(config.server.port, () => {
  //   console.log("Sever started and listening on PORT =", config.server.port);
  // });

  // attachListeners(clients);
  attachTelegramListeners(clients);
};

start().catch(console.log);
