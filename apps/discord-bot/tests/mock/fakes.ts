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
    find: sinon.stub().returnsThis(),
    threads: {
      create: sinon.stub().returnsThis(),
      send: sendStub,
    },
    send: sendStub,
  },
};

export const fakeDiscordClient = {
  guilds: {
    cache: {
      get: sinon.stub().returnsThis(),
      channels: channelStub,
      send: sendStub,
    },
  },
} as unknown as Client;
