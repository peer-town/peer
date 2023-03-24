import {Client} from "discord.js";
import {ComposeClient} from "@composedb/client";
import {sampleComment, sampleThread} from "../data";
import * as sinon from 'sinon';

export const fakeDiscordClient = {
  guilds: {
    cache: {
      get: () => this,
    },
    channels: {
      cache: [],
      create: sinon.stub().returns(
        new Promise((res) => res({
          id: 1,
          send: sinon.stub(),
        }))
      ),
    }
  }
} as unknown as Client;
export const fakeComposeClient = {} as ComposeClient;
export const fakeComposeQueryClient = () => ({
  fetchCommentDetails: async (id: string) => sampleComment,
  fetchThreadDetails: async (id: string) => sampleThread,
}) as any;
