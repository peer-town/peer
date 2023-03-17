export const config = {
  server: {
    port: process.env.AGGREGATOR_PORT || 4000,
  },
  compose: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
  },
  discord: {
    token: process.env.DISCORD_TOKEN || "",
    bot: process.env.DISCORD_BOT_NAME || "devnode-bot",
    channel: process.env.DISCORD_SERVER_NAME || "devnode",
  }
};
