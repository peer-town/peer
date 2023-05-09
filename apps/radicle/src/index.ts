import {initServer} from "./server";
import {config} from "./config";
import {initRadRepoDirectory} from "./core/cli";

const start = async () => {
  const server = initServer();
  server.listen(config.server.port, () => {
    console.log("Radicle server started and listening on PORT=", config.server.port);
  });
  initRadRepoDirectory();
};

start().catch(console.log);
