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
import {isRight, left, right} from "../../../utils/fp";
import { DIDSession } from "did-session";
import {isEmpty, isNil, omit} from "lodash";

export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

export const queryHandler = composeQueryHandler();

const socialPlatformSchema = z.object({
  userId: z.string().min(1),
  platform: z.string().min(1),
  platformId: z.string().min(1),
  communityName: z.string().min(1),
  communityId: z.string().min(1),
  communityAvatar: z.string().min(1),
});
const socialPlatformInputSchema = z.object({
  session: z.string(),
  socialPlatform: socialPlatformSchema,
});

const createCommunitySchema = z.object({
  session: z.string(),
  communityName: z.string(),
  description: z.string(),
  socialPlatform: socialPlatformSchema.omit({
    communityId: true,
  }),
  tags:z.array(z.object({
    id:z.string(),
    tag:z.string()
  }))
});

const UserCommunityRelationSchema = z.object({
  session: z.string(),
  userId: z.string(),
  communityId: z.string(),
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
        //create community
        const response = await handler.createCommunity({
          communityName: input.communityName,
          description: input.description,
        });
        if (response.errors && response.errors.length > 0) {
          return left(response.errors);
        }
        const communityId = response.data.createCommunity.document.id;
        //add social platform
        const platform = {
          ...input.socialPlatform,
          communityId,
        } as SocialPlatformInput;
        const socialPlatformResp = await handler.createSocialPlatform(platform);
        if (socialPlatformResp.errors && socialPlatformResp.errors.length > 0) {
          return left(socialPlatformResp.errors);
        }
        //create userCommunity relation
        const payload = { userId: platform.userId, communityId: communityId };
        const userCommunityRelationResp =
          await handler.createUserCommunityRelation(payload);
        if (userCommunityRelationResp.errors && userCommunityRelationResp.errors.length > 0) {
          return left(userCommunityRelationResp.errors);
        }
        //add tags to community
        const {tags} = input;
        if(tags.length>0 && !isEmpty(tags) && !isNil(tags)){
          const promises =  tags.map(async (tag)=>{
            const tagId = tag.id ;
           const  tagResponse = await handler.createCommunityTags(tagId as string, communityId as string);
            if (tagResponse.errors && tagResponse.errors.length > 0) {
              return left(tagResponse.errors);
            }
            return right(tagResponse.data)
          })
         const result = await Promise.all(promises);
          const checkLeft = result.filter((data) => !isRight(data as any))
          if(checkLeft.length>0){
            return left({message: "error occurred ",error: result});
          }
        }
        return userCommunityRelationResp.errors && userCommunityRelationResp.errors.length > 0
          ? left(userCommunityRelationResp.errors)
          : right({ ...response.data, ...socialPlatformResp.data, ...userCommunityRelationResp.data });
      } catch (e) {
        return left(e);
      }
    }),
  createSocialPlatform: publicProcedure
    .input(socialPlatformInputSchema)
    .mutation(async ({ input }) => {
      try {
        const handler = await getHandler(input.session);
        const socialPlatformResp = await handler.createSocialPlatform(
          input.socialPlatform as SocialPlatformInput
        );

        return socialPlatformResp.errors && socialPlatformResp.errors.length > 0
          ? left(socialPlatformResp.errors)
          : right(socialPlatformResp.data);
      } catch (e) {
        return left(e);
      }
    }),
  createUserCommunityRealtion: publicProcedure
    .input(UserCommunityRelationSchema)
    .mutation(async ({ input }) => {
      try {
        const handler = await getHandler(input.session);
        const payload = omit(input, "session");
        const relationResp = await handler.createUserCommunityRelation(
          payload as any
        );

        return relationResp.errors && relationResp.errors.length > 0
          ? left(relationResp.errors)
          : right(relationResp.data);
      } catch (e) {
        return left(e);
      }
    }),
  fetchCommunityUsingStreamId: publicProcedure
    .input(z.object({ streamId: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await queryHandler.fetchCommunityDetails(
          input.streamId as string
        );
        return response.errors && response.errors.length > 0
          ? left(response.errors)
          : right(response);
      } catch (e) {
        return left(e);
      }
    }),
  fetchCommunityTags: publicProcedure
  .input(z.object({ streamId: z.string() }))
  .query(async ({ input }) => {
    try {
      const response = await queryHandler.fetchCommunityTags(
        input.streamId as string
      );
      return response.errors && response.errors.length > 0
        ? left(response.errors)
        : right(response);
    } catch (e) {
      return left(e);
    }
  }),
});
