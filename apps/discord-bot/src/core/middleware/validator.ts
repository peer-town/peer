import joi from "joi";
import {NextFunction, Request, Response} from "express";
import {Resp} from "../utils/response";

export const commentSchema = joi.object({
  commentId: joi.string().required(),
});

export const threadSchema = joi.object({
  threadId: joi.string().required(),
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
