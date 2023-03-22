import {config} from "./config";

export const constants = {
  PLATFORM_DEVNODE_ID: "devnode",
  PLATFORM_DEVNODE_NAME: "devnode",
  PLATFORM_DISCORD_NAME: "discord",

  newChannelReason: "Channel for devnode platform communications",
  newCategoryReason: "Category for devnode platform communications",
  welcomeMessage: "Welcome to Devnode!\nI will help you sync messages to devnode platform.",

  replies: {
    noPermsToDel: "I should delete this but I can't! ADMIN PLS HELP!",
    noMsgOutOfThread: "You can only start threads or reply to threads in the devnode channel",
    userUnknown: `You must have an account on devnode to create thread or reply. Please create an account on ${config.devnodeWebsite}`,
  },
}
