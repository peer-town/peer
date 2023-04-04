import {Client} from "discord.js";
import {ComposeClient} from "@composedb/client";
import {sampleComment, sampleThread} from "../data";
import * as sinon from 'sinon';

export const fakeComposeClient = {} as ComposeClient;

export const fakeComposeQueryClient = () => ({
  fetchCommentDetails: async (id: string) => sampleComment,
  fetchThreadDetails: async (id: string) => sampleThread,
}) as any;

export const sendStub = sinon.stub().resolves({id: 1,});
export const channelStub = {
  cache: {
    get: sinon.stub().returnsThis(),
    send: sendStub,
  },
};

export const fakeDiscordClient = {
  guilds: {
    cache: {
      get: sinon.stub().returnsThis(),
      send: sendStub,
      channels: channelStub,
    },
  },
  channels: {
    cache: {
      get: sinon.stub().returnsThis(),
      send: sendStub,
    },
  },

} as unknown as Client;
