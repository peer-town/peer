import {ComposeClient} from "@composedb/client";
import {gql} from "graphql-request";
import {CreateRadicleRepoPayload} from "./types";

export const createRadicleRepo = async (compose: ComposeClient, payload: CreateRadicleRepoPayload) => {
  const query = gql`
    mutation CreateRadicleRepo($input: CreateUserRadicleRepoInput!) {
      createUserRadicleRepo(input: $input) {
        document {
          id
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      content: {
        userId: payload.userId,
        name: payload.name,
        description: payload.description,
        url: payload.url,
        radId: payload.radId,
      },
    },
  });
}
