import {initDiscord, initServer} from "./core";
import {config} from "./config";
import {ComposeClient} from "@composedb/client";
import {definition} from "@devnode/composedb";
import {attachListeners} from "./bots/discord";
import {Clients} from "./core/types";

const start = async () => {
  const discordClient = await initDiscord();
  const composeClient = new ComposeClient({
    ceramic: config.compose.nodeUrl,
    definition,
  });

  const clients: Clients = {
    discord: discordClient,
    compose: composeClient,
  };

  const server = initServer(clients);
  server.listen(config.server.port, () => {
    console.log("Sever started and listening on PORT =", config.server.port);
  });

  attachListeners(clients);
};

start().catch(console.log);
