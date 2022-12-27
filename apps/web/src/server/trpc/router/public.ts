import { GraphQLClient, gql } from "graphql-request";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@devnode/database";

const client = new GraphQLClient(process.env.CERAMIC_GRAPH, {});

export const publicRouter = router({
  getAllCommunities: publicProcedure.query(async () => {
    const communities = await prisma.community.findMany({});
    return communities;
  }),

  getAllThreads: publicProcedure.query(async () => {
    const query = gql`
      {
        threadIndex(first: 100) {
          edges {
            node {
              id
              title
              author {
                id
              }
              community
              createdAt
            }
          }
        }
      }
    `;
    const threads = await client.request(query);
    return threads.threadIndex?.edges;
  }),

  getAllComments: publicProcedure.query(async () => {
    const query = gql`
      {
        commentIndex(first: 100) {
          edges {
            node {
              id
              threadID
              text
              author {
                id
              }
              createdAt
            }
          }
        }
      }
    `;
    const comments = await client.request(query);
    return comments.commentIndex?.edges;
  }),

  getAuthorDiscordForThread: publicProcedure
    .input(z.object({ threadStreamId: z.string() }))
    .query(async ({ input }) => {
      let thread = await prisma.thread.findFirstOrThrow({
        where: {
          streamId: input.threadStreamId,
        },
      });

      let user = await prisma.user.findFirstOrThrow({
        where: {
          discordUsername: thread.discordAuthor,
        },
      });

      return user;
    }),

  getAuthorDiscordForComment: publicProcedure
    .input(z.object({ commentStreamId: z.string() }))
    .query(async ({ input }) => {
      let comment = await prisma.comment.findFirstOrThrow({
        where: {
          streamId: input.commentStreamId,
        },
      });

      let user = await prisma.user.findFirstOrThrow({
        where: {
          discordUsername: comment.discordAuthor,
        },
      });

      return user;
    }),

    getDiscordUser: publicProcedure
    .input(z.object({ didSession: z.string() }))
    .query(async ({ input }) => {
      let  discordUsername = await prisma.user.findFirstOrThrow({
        where: {
          didSession: input.didSession,
        },
      });

      return discordUsername;
    }),
});
