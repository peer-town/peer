import {logger} from "./utils/logger";
import express, {Express} from "express";
import cors from "cors";
import {apiKeyAuth} from "./middleware/auth";
import {config} from "./config";
import * as repos from "./core/repos";
import {publishRepoSchema, validator} from "./middleware/validator";

process.on("uncaughtException", (error, origin) => {
  console.log(error);
  logger.error('core', {error, origin});
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('core', {reason, promise});
});

export const initServer = (): Express => {
  const server = express();
  server.use(cors());
  server.use(express.urlencoded({extended: true}));
  server.use(express.json());
  server.use(apiKeyAuth(config.server.apiKey));

  const router = express.Router();
  router.get("/ping", (_, res) => res.send("pong"));
  router.post("/repos/publish", validator(publishRepoSchema), repos.publish);
  server.use("/api", router);

  return server;
}
