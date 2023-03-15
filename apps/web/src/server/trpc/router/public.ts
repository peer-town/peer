import {GraphQLClient} from "graphql-request";
import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {composeQueryHandler} from "@devnode/composedb";

const client = new GraphQLClient(process.env.CERAMIC_GRAPH, {});

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

  fetchCommunities: publicProcedure.query(async () => {
    const allCommunities =
      await queryHandler.fetchAllCommunitiesPlatformDetails("discord");
    return allCommunities;
  }),

  fetchAllCommunities: publicProcedure.query(async () => {
    return await queryHandler.fetchAllCommunities();
  }),
})
