import {DIDSession} from "did-session";
import {getBoolean} from "../core/utils/data";

export const config = {
  server: {
    port: process.env.AGGREGATOR_PORT || 4000,
    apiKey: process.env.AGGREGATOR_API_KEY || "sample-api-key",
  },
  compose: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
    session: process.env.CERAMIC_SESSION || "",
  },
  discord: {
    token: process.env.DISCORD_TOKEN || "",
    channel: process.env.DISCORD_SERVER_NAME || "devnode",
    channelCategory: process.env.DISCORD_CHANNEL_CATEGORY_NAME || "DEVNODE COMMS"
  },
  debug: {
    devs: ["933958006218031114", "922429029544525866"],
  },
  features: {
    devLogs: getBoolean(process.env.AGGREGATOR_FEAT_ENABLE_LOGS),
  },
  devnodeWebsite: process.env.DEVNODE_WEBSITE || "http://localhost:3000",
};

export const getBotDid = async (): Promise<any> => {
  const session = await DIDSession.fromSession(config.compose.session);
  return session.did;
}
