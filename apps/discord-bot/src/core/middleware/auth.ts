import {NextFunction, Request, Response} from "express";
import {Resp} from "../utils/response";

export const apiKeyAuth = (apiKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKeyHeader = req.headers['x-api-key'];
    if (apiKeyHeader !== apiKey) {
      return Resp.unAuth(res, "unauthorized");
    }
    next();
  };
}
