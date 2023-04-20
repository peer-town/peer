import {ComposeClient} from "@composedb/client";
import {CreateReputationPayload, UpdateReputationPayload} from "./types";
import {gql} from "graphql-request";

export const createReputation = async (compose: ComposeClient, payload: CreateReputationPayload) => {
  const query = gql`
    mutation AddReputation($input: CreateReputationInput!) {
      createReputation(input: $input) {
        document {
          id
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      content: payload,
    },
  });
}

export const updateReputation = async (compose: ComposeClient, payload: UpdateReputationPayload) => {
  const query = gql`
    mutation UpdateReputation($input: UpdateReputationInput!) {
      updateReputation(input: $input) {
        document {
          id
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      id: payload.id,
      content: {
        score: payload.score,
      },
    },
  });
}
