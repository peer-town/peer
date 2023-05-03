import {ComposeClient} from "@composedb/client";
import {UpdateCommunityPayload, UpdateSocialPlatformPayload} from "./types";
import {gql} from "graphql-request";

export const updateCommunityDetails = async (compose: ComposeClient, payload: UpdateCommunityPayload) => {
  const query = gql`
    mutation UpdateCommunity($input: UpdateCommunityInput!) {
      updateCommunity(input: $input) {
        document {
          id
          communityName
          description
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      id: payload.communityId,
      content: {
        communityName: payload.communityName,
        description: payload.description,
      },
    },
  });
}

export const updateSocialPlatformDetails = async (compose: ComposeClient, payload: UpdateSocialPlatformPayload) => {
  const query = gql`
    mutation UpdateSocialPlatform($input: UpdateSocialPlatformInput!) {
      updateSocialPlatform(input: $input) {
        document {
          id
          communityName
          communityAvatar
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      id: payload.socialPlatformId,
      content: {
        communityName: payload.communityName,
        communityAvatar: payload.communityAvatar,
      },
    },
  });
}

