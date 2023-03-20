import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  composeMutationHandler,
  composeQueryHandler,
  definition,
  SocialPlatformInput,
} from "@devnode/composedb";
import { ComposeClient } from "@composedb/client";
import { config } from "../../../config";
import { left, right } from "../../../utils/fp";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

const socialPlatformSchema = z.object({
  userId: z.string().min(1),
  platform: z.string().min(1),
  platformId: z.string().min(1),
  communityName: z.string().min(1),
  communityId: z.string().min(1),
  communityAvatar: z.string().min(1),
});
const socialPlatformInputSchema = z.object({
  session : z.string(),
  socialPlatform: socialPlatformSchema
});

const createCommunitySchema = z.object({
  session: z.string(),
  communityName: z.string(),
  socialPlatform: socialPlatformSchema.omit({
    communityId: true,
  }),
});

const getHandler = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return await composeMutationHandler(compose);
};

export const communityRouter = router({
  createCommunity: publicProcedure
    .input(createCommunitySchema)
    .mutation(async ({ input }) => {
      try {
        const handler = await getHandler(input.session);
        const response = await handler.createCommunity(input.communityName);
        if (response.errors && response.errors.length > 0) {
          return left(response.errors);
        }
        const communityId = response.data.createCommunity.document.id;
        const platform = {
          ...input.socialPlatform,
          communityId,
        } as SocialPlatformInput;
        const socialPlatformResp = await handler.createSocialPlatform(platform);

        return socialPlatformResp.errors && socialPlatformResp.errors.length > 0
          ? left(socialPlatformResp.errors)
          : right({ ...response.data, ...socialPlatformResp.data });
      } catch (e) {
        return left(e);
      }
    }),
  createSocialPlatform: publicProcedure
    .input(socialPlatformInputSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("input",input);
        const handler = await getHandler(input.session);
        const socialPlatformResp = await handler.createSocialPlatform(input.socialPlatform as SocialPlatformInput);

        return socialPlatformResp.errors && socialPlatformResp.errors.length > 0
          ? left(socialPlatformResp.errors)
          : right(socialPlatformResp.data);
      } catch (e) {
        return left(e);
      }
    }),
});
