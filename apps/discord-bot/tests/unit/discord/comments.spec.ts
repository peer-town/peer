import {Clients} from "../../../src/core/types";
import {fakeComposeQueryClient, fakeDiscordClient} from "../../mock/fakes";
import * as sinon from "sinon";
import {handleNewComment} from "../../../src/bots/discord/comments/handler";
import {expect} from "../../setup";
import {constants} from "../../../src/config";
import {ChannelType, MessageType} from "discord.js";
import {DIDSession} from "did-session";

describe("comments.handleNewComment", () => {
  const createCommentMock = sinon.mock().resolves({data: "done"});
  const deleteMessageMock = sinon.stub().resolves();
  const sendMock = sinon.stub().resolves();

  const clients: Clients = {
    discord: fakeDiscordClient,
    compose: {
      setDID: sinon.mock(),
      executeQuery: createCommentMock,
    } as any,
    composeQuery: fakeComposeQueryClient,
  };

  const message = {
    author: {bot: false, send: sendMock},
    channel: {name: "devnode", type: ChannelType.PublicThread},
    type: MessageType.Default,
    content: "sample message",
    delete: deleteMessageMock,
    createdAt: new Date(),
  };

  beforeEach(() => {
    sinon.restore();
    sinon.reset();
  });

  it("should ignore if the message is from bot", async () => {
    await handleNewComment(clients, {author: {bot: true}} as any);
    expect(createCommentMock).to.be.callCount(0);
  });

  it("should ignore if the message is not in text or thread channel", async () => {
    const message = {
      author: {bot: false},
      channel: {type: ChannelType.GuildAnnouncement},
    };
    await handleNewComment(clients, message as any);
    expect(createCommentMock).to.be.callCount(0);
  });

  it("should ignore if the message is not in devnode channel", async () => {
    const message = {
      author: {bot: false},
      channel: {name: "not devnode", type: ChannelType.PublicThread},
    };
    await handleNewComment(clients, message as any);
    expect(createCommentMock).to.be.callCount(0);
  });

  it("should ignore if the message is not a default message type", async () => {
    const message = {
      author: {bot: false},
      channel: {name: "not devnode", type: ChannelType.PublicThread},
      type: MessageType.ThreadCreated,
    };
    const other = {
      ...message,
      type: MessageType.ChannelNameChange,
    }
    await handleNewComment(clients, message as any);
    await handleNewComment(clients, other as any);
    expect(createCommentMock).to.be.callCount(0);
  });


  it("should delete the message if it is outside the thread", async () => {
    const updated = {
      ...message,
      channel: {...message.channel, type: ChannelType.GuildText}
    }
    await handleNewComment(clients, updated as any);
    expect(deleteMessageMock).to.callCount(1);
    expect(sendMock).to.callCount(1);
    expect(sendMock).to.calledWith(constants.replies.noMsgOutOfThread);
  });

  it.skip("should delete the message if user does not exists", async () => {
    const clients_ = {
      ...clients,
      composeQuery: () => ({
        fetchUserByPlatformDetails: sinon.mock().resolves(undefined)
      }),
    }
    const updated = {
      ...message,
      channel: {...message.channel, type: ChannelType.PublicThread}
    }
    await handleNewComment(clients_ as any, updated as any);
    expect(deleteMessageMock).to.calledOnce;
    expect(sendMock).to.callCount(1);
    expect(sendMock).to.calledWith(constants.replies.userUnknown);
  });

  it("should ignore if thread is not found on compose", async () => {
    const clients_ = {
      ...clients,
      composeQuery: () => ({
        fetchUserByPlatformDetails: sinon.mock().resolves({node: {id: 1}}),
        fetchThreadBySocialThreadId: sinon.mock().resolves(undefined),
      }),
    }
    const updated = {
      ...message,
      channel: {...message.channel, type: ChannelType.PublicThread}
    }
    await handleNewComment(clients_ as any, updated as any);
    expect(createCommentMock).to.callCount(0);
  });

  it("should create a commment on compose", async () => {
    sinon.stub(DIDSession, "fromSession").resolves({did: "sample-did"} as any);
    const clients_ = {
      ...clients,
      composeQuery: () => ({
        fetchUserByPlatformDetails: sinon.mock().resolves({node: {id: 1}}),
        fetchThreadBySocialThreadId: sinon.mock().resolves({node: {id: 1}}),
      }),
    }
    const updated = {
      ...message,
      channel: {...message.channel, type: ChannelType.PublicThread}
    }
    await handleNewComment(clients_ as any, updated as any);
    expect(createCommentMock).to.callCount(1);
  });
});
