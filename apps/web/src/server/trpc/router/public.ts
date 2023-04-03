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
    .input(z.object({communityId: z.string()}))
    .query(async ({input}) => {
      if (!input.communityId) return [];
      return await queryHandler.fetchAllCommunityThreads(input.communityId);
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
      after: z.string().nullish(),
    }))
    .query(async ({input}) => {
      return await queryHandler.fetchCommunities(input.first, input.after);
  }),

  fetchAllCommunities: publicProcedure.query(async () => {
    return await queryHandler.fetchAllCommunities();
  }),
})
