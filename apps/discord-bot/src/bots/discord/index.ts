import {Client, Events} from "discord.js";
import * as commentHandler from "./comments/handler";
import * as threadHandler from "./threads/handler";

export { commentHandler };

export const attachListeners = (client: Client) => {
  client.on(Events.MessageCreate, commentHandler.handleNewComment);
  client.on(Events.ThreadCreate, threadHandler.handleNewThread);
};
