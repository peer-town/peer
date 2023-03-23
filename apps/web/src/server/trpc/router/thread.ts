import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  composeMutationHandler,
  definition,
  ThreadInput,
} from "@devnode/composedb";
import { ComposeClient } from "@composedb/client";
import { config } from "../../../config";
import { left, right } from "../../../utils/fp";
import { omit } from "lodash";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

const createThreadSchema = z.object({
  session: z.string(),
  communityId: z.string(),
  userId: z.string(),
  threadId: z.string(),
  title: z.string(),
  body: z.string(),
  createdFrom: z.string(),
  createdAt: z.string(),
});

const updateThreadSocialId = z.object({
  session: z.string(),
  streamId: z.string(),
  threadId: z.string(),
});

const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
};

export const threadRouter = router({
  createThread: publicProcedure
    .input(createThreadSchema)
    .mutation(async ({ input }) => {
      try {
        const handler = await getHandler(input.session);
        const payload = omit(input, ["session"]);
        const response = await handler.createThread(payload as ThreadInput);
        return response.errors && response.errors.length > 0
          ? left(response.errors)
          : right(response.data);
      } catch (e) {
        return left(e);
      }
    }),
  updateThreadWithSocialId: publicProcedure
    .input(updateThreadSocialId)
    .mutation(async ({ input }) => {
      try {
        const handler = await getHandler(input.session);
        const payload = omit(input, ["session"]);
        const response = await handler.updateThreadWithSocialThreadId(
          input.streamId,
          input.threadId
        );
        return response.errors && response.errors.length > 0
          ? left(response.errors)
          : right(response.data);
      } catch (e) {
        return left(e);
      }
    }),
});
