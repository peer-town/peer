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

  getAuthor: publicProcedure
    .input(z.object({ pkh: z.string() }))
    .query(async ({ input }) => {
      let user = await prisma.user.findFirstOrThrow({
        where: {
          didpkh: input.pkh,
        },
      });

      return user;
    }),
});
