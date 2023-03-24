import {Events} from "discord.js";
import * as commentHandler from "./comments/handler";
import * as threadHandler from "./threads/handler";
import * as channelHandler from "./channels/handler";
import {Clients} from "../../core/types";

export {commentHandler, threadHandler};

export const attachListeners = (clients: Clients) => {
  const discord = clients.discord;

  discord.on(Events.MessageCreate, (message) => commentHandler.handleNewComment(clients.compose, message));
  discord.on(Events.ThreadCreate, (thread) => threadHandler.handleNewThread(clients.compose, thread));
  discord.on(Events.GuildCreate, channelHandler.handleServerJoin);
};
