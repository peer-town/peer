import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {
  composeMutationHandler,
  composeQueryHandler,
  definition,
} from "@devnode/composedb";
import {ComposeClient} from "@composedb/client";
import {config} from "../../../config";
import {left, right} from "../../../utils/fp";
import {DIDSession} from "did-session";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});


const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
};

const CreateTagSchema = z.object({
  session: z.string(),
  tag: z.string(),
});

export const tagRouter = router({
  getAllTags: publicProcedure
      .query(async () => {
        try {
          const response = await composeQueryHandler().fetchAllTags(

          );
          return response ? right(response) : right({});
        } catch (e) {
          return left(e);
        }
      }),
  createTag: publicProcedure
      .input(CreateTagSchema)
      .mutation(async ({input}) => {
        try {
          const handler = await getHandler(input.session);
          const tagResp = await handler.createTag(
              input.tag
          );
          return tagResp.errors && tagResp.errors.length > 0
              ? left(tagResp.errors)
              : right(tagResp.data);
        } catch (e) {
          return left(e);
        }
      }),
});
