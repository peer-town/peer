import {gql} from "graphql-request";
import {graphqlClient} from "../clients";
import {UserThreadResponse} from "./types";

export const getUserThreadsByAuthorId = async (authorId: string, last: number, before?: string): Promise<UserThreadResponse> => {
  const query = gql`
    query UserThreads($authorId: ID!, $last: Int!, $before: String!) {
      node(id: $authorId) {
        ... on CeramicAccount {
          threadList(last: $last, before: $before) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
                communityId
                userId
                title
                body
              }
            }
          }
        }
      }
    }
  `;
  const response = await graphqlClient.request(query, {
    authorId: authorId,
    last: last || 20,
    before: before || "",
  });
  return response?.node?.threadList;
}
