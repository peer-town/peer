import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  composeMutationHandler,
  definition,
  ThreadInput,
} from "@devnode/composedb";
import { ComposeClient } from "@composedb/client";
import { config } from "../../../config";
import {isRight, left, right} from "../../../utils/fp";
import {get, has, omit} from "lodash";
import { DIDSession } from "did-session";
import {SocialThreadId} from "../../types";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

const createThreadSchema = z.object({
  session: z.string(),
  communityId: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  createdFrom: z.string(),
  createdAt: z.string(),
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
        if(response.data) {
          const threadId = get(response.data, "createThread.document.id");
          const apiResponse = await handleWebToAggregator(threadId);
          const data = await apiResponse.json();
          if (has(data, "data[0]")) {
            const updated = await updateThread(handler, threadId, data.data[0]);
            if (isRight(updated)) {
              return right({createThread: response.data, updateThread: updated.value});
            } else {
              return updated;
            }
          } else {
            return left(data);
          }
        } else {
          return left(response.errors);
        }
      } catch (e) {
        return left(e);
      }
    }),
});

const updateThread = async (handler, streamId, social: SocialThreadId) => {
  try {
    const response = await handler.updateThreadWithSocialThreadId(streamId, social);
    return response.errors && response.errors.length > 0
      ? left(response.errors)
      : right(response.data);
  } catch (e) {
    return left(e);
  }
}

const handleWebToAggregator = async (threadId: string) => {
  const endpoint = `${config.aggregator.endpoint}/web-thread`;
  return await fetch(endpoint, {
    body: JSON.stringify({
      threadId: threadId,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.aggregator.apiKey,
    },
  });
};
