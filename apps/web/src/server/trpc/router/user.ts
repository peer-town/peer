import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {composeMutationHandler, composeQueryHandler, definition} from "@devnode/composedb";
import {ComposeClient} from "@composedb/client";
import {config} from "../../../config";
import {left, right} from "../../../utils/fp";
import {DIDSession} from "did-session";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

const createUserSchema = z.object({
  session: z.string(),
  userPlatformDetails: z.object({
    platformId: z.string(),
    platormName: z.string(),
    platformAvatar: z.string(),
    platformUsername: z.string(),
  }),
  walletAddress: z.string(),
});

const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
}

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({address: z.string()}))
    .query(async ({input}) => {
      try {
        const response = await composeQueryHandler().fetchUserDetails(input.address);
        return response && response.node ? right(response.node) : right({});
      } catch (e) {
        return left(e);
      }
    }),

  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({input}) => {
      try {
        const handler = await getHandler(input.session);
        const response = await handler.createUser(input.userPlatformDetails as any, input.walletAddress);
        return (response.errors && response.errors.length > 0)
          ? left(response.errors)
          : right(response.data);
      } catch (e) {
        return left(e);
      }
    }),

    updateUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({input}) => {
      try {
        const handler = await getHandler(input.session);
        const response = await handler.updateUser(input.userPlatformDetails as any, input.walletAddress);
        return (response.errors && response.errors.length > 0)
          ? left(response.errors)
          : right(response.data);
      } catch (e) {
        return left(e);
      }
    }),
});
