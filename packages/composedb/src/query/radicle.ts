import {gql} from "graphql-request";
import {graphqlClient} from "../clients";
import {UserRepoResponse} from "./types";

export const getUserRepos = async (authorId: string, last: number, before?: string): Promise<UserRepoResponse> => {
  const query = gql`
    query UserRepos($authorId: ID!, $last: Int!, $before: String!) {
      node(id: $authorId) {
        ... on CeramicAccount {
          userRadicleRepoList(last: $last, before: $before) {
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
                author{
                id
                }
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
  return response?.node?.userRadicleRepoList;
}
