import { expect } from '../../setup';
import { Client, Guild, ThreadChannel } from 'discord.js';
import * as sinon from 'sinon';
import { postComment } from "../../../src/bots/discord/comments/handler";

// TODO: requires refactoring and updates
describe.skip('postComment', () => {
  let client: Client;
  let guild: Guild;
  let thread: ThreadChannel;

  beforeEach(() => {
    // Create a fake `Client` object with the required functions
    client = {
      guilds: {
        cache: {
          get: sinon.stub().callsFake((id) => {
            if (id === 'server-id') {
              return {
                channels: {
                  cache: {
                    get: sinon.stub().callsFake((id) => {
                      if (id === 'thread-id') {
                        return {
                          send: sinon.stub().resolves(),
                        }
                      } else {
                        return undefined;
                      }
                    }),
                  },
                },
              };
            } else {
              return undefined;
            }
          }),
        },
      },
    } as unknown as Client;
  });

  it('should post comment to discord', async () => {
    guild = client.guilds.cache.get('server-id')!;
    thread = guild.channels.cache.get('thread-id')! as ThreadChannel;

    const message = {
      serverId: 'server-id',
      threadId: 'thread-id',
      userName: 'test-user',
      userAvatar: "some",
      userProfileLink: "",
      redirectLink: "",
      text: 'test message',
      threadStreamId: 'thread-stream-id',
    };

    await postComment(client, message);

    expect(client.guilds.cache.get).to.have.been.calledWith(message.serverId);
    expect(guild.channels.cache.get).to.have.been.calledWith(message.threadId);
  });

  it('should throw an error if server is not found', async () => {
    const message = {
      serverId: 'unknown-server',
      threadId: 'thread-id',
      userName: 'test-user',
      userAvatar: "some",
      userProfileLink: "",
      redirectLink: "",
      text: 'test message',
      threadStreamId: 'thread-stream-id',
    };

    await expect(postComment(client, message)).to.be.rejectedWith('unknown server');
  });

  it('should throw an error if thread is not found', async () => {
    const message = {
      serverId: 'server-id',
      threadId: 'unknown-thread',
      userName: 'test-user',
      userAvatar: "some",
      userProfileLink: "",
      redirectLink: "",
      text: 'test message',
      threadStreamId: 'thread-stream-id',
    };

    await expect(postComment(client, message)).to.be.rejectedWith('unknown thread');
  });
});
