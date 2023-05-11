import {Response} from "express";

export const Resp = {
  ok: (res: Response, msg: string) => res.status(200).json({msg}).end(),
  okD: (res: Response, data: object, msg: string) => res.status(200).json({msg, data}).end(),
  notOk: (res: Response, msg: string) => res.status(400).json({msg}).end(),
  unAuth: (res: Response, msg: string) => res.status(401).json({msg}).end(),
  error: (res: Response, msg: string) => res.status(500).json({msg}).end(),
}
