import {DIDSession} from "did-session";
import {compose} from "../handlers/onThreadCreateWeb";

export const config = {
  server: {
    port: process.env.AGGREGATOR_PORT || 4000,
  },
  compose: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
    session: process.env.DID_SESSION || "",
  },
  discord: {
    token: process.env.DISCORD_TOKEN || "",
    bot: process.env.DISCORD_BOT_NAME || "devnode-bot",
    channel: process.env.DISCORD_SERVER_NAME || "devnode",
  },
  devnodeWebsite: process.env.DEVNODE_WEBSITE || "http://localhost:3000",
};

export const getBotDid = async (): Promise<any> => {
  const session = await DIDSession.fromSession(config.compose.session);
  return session.did;
}
