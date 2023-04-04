import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {definition, composeMutationHandler, composeQueryHandler } from "@devnode/composedb";
import {ComposeClient} from "@composedb/client";
import {config} from "../../../config";
import {left, right} from "../../../utils/fp";
import {omit, get} from "lodash";
import {DIDSession} from "did-session";
import {SocialCommentId} from "../../types";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});
const queryHandler = composeQueryHandler();

const createCommentSchema = z.object({
  session: z.string(),
  comment: z.string(),
  userId: z.string(),
  threadId: z.string(),
  createdFrom: z.string(),
  createdAt: z.string(),
});

const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
}

export const commentRouter = router({
  createComment: publicProcedure
    .input(createCommentSchema)
    .mutation(async ({input}) => {
      try {
        const handler = await getHandler(input.session);
        const payload = omit(input, ["session"]);
        const response = await handler.createComment(payload as any);
        if(response.data) {
          const commentId = get(response.data, "createComment.document.id");
          handleWebToAggregator(commentId)
            .then((res) => res.json())
            .then((data) => {
              if (has(data, "data[0]")) {
                updateComment(handler, commentId, data.data[0])
                  .then(console.log)
                  .catch(console.log);
              }
            });
        }
        return (response.errors && response.errors.length > 0)
          ? left(response.errors)
          : right(response.data);
      } catch (e) {
        return left(e);
      }
    }),

  fetchCommentsByThreadId: publicProcedure
    .input(z.object({
      threadId: z.string(),
      first: z.number().min(1).max(100),
      after: z.string().nullish(),
    }))
    .query(async ({input}) => {
      const {threadId, first, after} = input;
      return await queryHandler.fetchCommentsByThreadId(threadId, first, after);
    }),
});

const updateComment = async (handler, streamId, social: SocialCommentId) => {
  try {
    const response = await handler.updateCommentWithSocialCommentId(streamId, social);
    return response.errors && response.errors.length > 0
      ? left(response.errors)
      : right(response.data);
  } catch (e) {
    return left(e);
  }
}

const handleWebToAggregator = async (commentId: string) => {
  const endpoint = `${config.aggregator.endpoint}/web-comment`;
  return await fetch(endpoint, {
      body: JSON.stringify({
        commentId: commentId,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.aggregator.apiKey,
      },
    }
  );
}
