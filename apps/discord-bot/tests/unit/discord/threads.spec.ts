import {Clients} from "../../../src/core/types";
import {fakeComposeQueryClient, fakeDiscordClient} from "../../mock/fakes";
import * as sinon from "sinon";
import {handleNewThread} from "../../../src/bots/discord/threads/handler";
import {expect} from "../../setup";
import {constants, config} from "../../../src/config";
import {ChannelType, MessageType} from "discord.js";
import {DIDSession} from "did-session";

describe("threads.handleNewThread", () => {
  const createThreadMock = sinon.mock().resolves({data: "done"});
  const deleteThreadMock = sinon.stub().resolves();
  const sendMock = sinon.stub().resolves();

  const clients: Clients = {
    discord: fakeDiscordClient,
    compose: {
      setDID: sinon.mock(),
      executeQuery: createThreadMock,
    } as any,
    composeQuery: fakeComposeQueryClient,
  };

  const thread = {
    fetchOwner: sinon.stub().resolves({
      user: {bot: false, send: sendMock}
    }),
    channel: {name: "devnode", type: ChannelType.PublicThread},
    type: ChannelType.PublicThread,
    content: "sample message",
    delete: deleteThreadMock,
    createdAt: new Date(),
    parent: {name: config.discord.channel}
  };

  beforeEach(() => {
    sinon.restore();
    sinon.reset();
  });

  it("should ignore if the thread is from bot", async () => {
    await handleNewThread(clients, {
      ...thread,
      fetchOwner: sinon.stub().resolves({user: { bot: true }}),
    } as any);
    expect(createThreadMock).to.be.callCount(0);
  });

  it("should ignore if the thread is not public thread", async () => {
    await handleNewThread(clients, {
      ...thread,
      type: ChannelType.GuildText,
    } as any);
    expect(createThreadMock).to.be.callCount(0);
  });

  it("should ignore if parent is not devnode", async () => {
    await handleNewThread(clients, {
      ...thread,
      parent: {name: "not devnode"}
    } as any);
    expect(createThreadMock).to.be.callCount(0);
  });

  it("should delete if the user is not found", async () => {
    const clients_ = {
      ...clients,
      composeQuery: () => ({
        fetchUserByPlatformDetails: sinon.mock().resolves(undefined),
      }),
    };
    await handleNewThread(clients_ as any, thread as any);
    expect(deleteThreadMock).to.be.callCount(1);
    expect(sendMock).to.be.callCount(1);
    expect(sendMock).to.be.calledWith(constants.replies.userUnknown);
  });

  it("should create thread on valid data", async () => {
    sinon.stub(DIDSession, "fromSession").resolves({did: "sample-did"} as any);
    const clients_ = {
      ...clients,
      composeQuery: () => ({
        fetchUserByPlatformDetails: sinon.mock().resolves({node: {id: 1}}),
        fetchCommunityUsingPlatformId: sinon.mock().resolves({node: {id: 1}}),
      }),
    };
    await handleNewThread(clients_ as any, thread as any);
    expect(createThreadMock).to.be.callCount(1);
  });

});
