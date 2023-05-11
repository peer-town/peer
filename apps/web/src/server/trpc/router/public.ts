import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {composeQueryHandler } from "@devnode/composedb";

const queryHandler = composeQueryHandler();

export const publicRouter = router({
  fetchAllThreads: publicProcedure.query(async () => {
    const allThreads = await queryHandler.fetchAllThreads();
    return allThreads;
  }),

  fetchAllUsers: publicProcedure.query(async () => {
    const allUsers = await queryHandler.fetchAllUsers();
    return allUsers;
  }),

  fetchAllUserThreads: publicProcedure
    .input(z.object({address: z.string()}))
    .query(async ({input}) => {
      return await queryHandler.fetchAllUserThreads(input.address);
    }),

  fetchAllCommunityThreads: publicProcedure
    .input(z.object({
      communityId: z.string(),
      first: z.number().nullish(),
      cursor: z.string().nullish(),
    }))
    .query(async ({input}) => {
      const {first, cursor, communityId} = input;
      return await queryHandler.fetchAllCommunityThreads(communityId, first, cursor);
    }),

  fetchThreadDetails: publicProcedure
    .input(z.object({threadId: z.string()}))
    .query(async ({input}) => {
      if (!input.threadId) return [];
      return await queryHandler.fetchThreadDetails(input.threadId);
    }),

  fetchCommunities: publicProcedure
    .input(z.object({
      first: z.number().min(1).max(100),
      cursor: z.string().nullish(),
    }))
    .query(async ({input}) => {

      try{
        return await queryHandler.fetchCommunities(input.first, input.cursor);
      }
      catch(e){
        return e?.response?.data?.communityIndex;
      }
  }),

  fetchAllCommunities: publicProcedure.query(async () => {
    return await queryHandler.fetchAllCommunities();
  }),
})
