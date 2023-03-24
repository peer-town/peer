import {DIDSession} from "did-session";

export const config = {
  server: {
    port: process.env.AGGREGATOR_PORT || 4000,
    apiKey: process.env.AGGREGATOR_API_KEY || "sample-api-key",
  },
  compose: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
    did: process.env.CERAMIC_DID_KEY || "",
  },
  discord: {
    token: process.env.DISCORD_TOKEN || "",
    channel: process.env.DISCORD_SERVER_NAME || "devnode",
    channelCategory: process.env.DISCORD_CHANNEL_CATEGORY_NAME || "DEVNODE COMMS"
  },
  devnodeWebsite: process.env.DEVNODE_WEBSITE || "http://localhost:3000",
};

export const getBotDid = async (): Promise<any> => {
  return config.compose.did;
}
