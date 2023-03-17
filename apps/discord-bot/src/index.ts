import {initDiscord, initServer} from "./core";
import {config} from "./config";
import {ComposeClient} from "@composedb/client";
import {definition} from "@devnode/composedb";

const start = async () => {
  const discordClient = await initDiscord();
  const composeClient = new ComposeClient({
    ceramic: config.compose.nodeUrl,
    definition,
  });

  const server = initServer({
    discord: discordClient,
    compose: composeClient,
  });

  server.listen(config.server.port, () => {
    console.log("Sever started and listening on PORT =", config.server.port);
  });

  // attachListeners(discordClient);
};

start().catch(console.log);
