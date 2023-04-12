import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {
  definition,
  composeMutationHandler,
  composeQueryHandler,
  updateVoteComment,
  downVoteComment
} from "@devnode/composedb";
import {ComposeClient} from "@composedb/client";
import {config} from "../../../config";
import {left, right} from "../../../utils/fp";
import {has, omit, get, isNil} from "lodash";
import {DIDSession} from "did-session";
import {SocialCommentId} from "../../types";
import {upVoteComment, getUserVoteOnComment} from "@devnode/composedb";

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

const voteCommentSchema = z.object({
  session: z.string(),
  commentId: z.string(),
  userId: z.string(),
});

const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
}

const getCompose = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return compose;
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
                  .catch(console.error);
              }
            })
            .catch(console.error);
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
      cursor: z.string().nullish(),
    }))
    .query(async ({input}) => {
      const {threadId, first, cursor} = input;
      return await queryHandler.fetchCommentsByThreadId(threadId, first, cursor);
    }),

  upVoteComment: publicProcedure
    .input(voteCommentSchema)
    .mutation(async ({input}) => {
      try {
        const {session, userId, commentId} = input;
        const compose = await getCompose(session);
        const existing = await getUserVoteOnComment(userId, commentId);
        if (!isNil(existing)) {
          const response = await updateVoteComment(compose, existing.node.id, true);
          return (response.errors && response.errors.length > 0)
            ? left(response.errors)
            : right(response.data);
        } else {
          const response = await upVoteComment(compose, commentId, userId);
          return (response.errors && response.errors.length > 0)
            ? left(response.errors)
            : right(response.data);
        }
      } catch (e) {
        return left(e);
      }
    }),

  downVoteComment: publicProcedure
    .input(voteCommentSchema)
    .mutation(async ({input}) => {
      try {
        const {session, userId, commentId} = input;
        const compose = await getCompose(session);
        const existing = await getUserVoteOnComment(userId, commentId);
        if (!isNil(existing)) {
          const response = await updateVoteComment(compose, existing.node.id, false);
          return (response.errors && response.errors.length > 0)
            ? left(response.errors)
            : right(response.data);
        } else {
          const response = await downVoteComment(compose, commentId, userId);
          return (response.errors && response.errors.length > 0)
            ? left(response.errors)
            : right(response.data);
        }
      } catch (e) {
        return left(e);
      }
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
