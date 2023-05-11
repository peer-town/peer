import joi from "joi";
import {NextFunction, Request, Response} from "express";
import {Resp} from "../utils/response";

export const publishRepoSchema = joi.object({
  username: joi.string().required(),
  repoUrl: joi.string().required(),
  description: joi.string().required(),
  branch: joi.string().required(),
});

export const validator = (schema: joi.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validateAsync(req.body);
      return next();
    } catch (e) {
      return Resp.notOk(res, "invalid payload");
    }
  }
}
