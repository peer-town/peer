import { GraphQLClient, gql } from "graphql-request";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const client = new GraphQLClient(process.env.CERAMIC_GRAPH, {});

export const publicRouter = router({
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
});
