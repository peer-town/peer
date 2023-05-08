import {gql} from "graphql-request";
import {graphqlClient} from "../clients";
import {UserRepoResponse} from "./types";

export const getUserRepos = async (authorId: string, first: number, after?: string): Promise<UserRepoResponse> => {
  const query = gql`
    query UserRepos($authorId: ID!, $first: Int!, $after: String!) {
      node(id: $authorId) {
        ... on CeramicAccount {
          userRadicleRepoList(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
                userId
                radId
                name
                description
                url
              }
            }
          }
        }
      }
    } 
 `;
  const response = await graphqlClient.request(query, {
    authorId: authorId,
    first: first || 20,
    after: after || "",
  });
  return response?.node?.userRadicleRepoList;
}
