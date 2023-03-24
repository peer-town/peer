import {expect} from "../../setup";
import {ChannelType, Guild} from "discord.js";
import * as sinon from "sinon";
import {handleServerJoin} from "../../../src/bots/discord/channels/handler";
import {config, constants} from "../../../src/config";

describe("channels.handleServerJoin", () => {
  let guild: Guild = {} as any;

  beforeEach(() => {
    guild.channels = {
      // @ts-ignore
      cache: [],
      create: sinon.stub().returns(
        new Promise((res) => res({
          id: 1,
          send: sinon.stub(),
        }))
      ),
    };
  });

  afterEach(() => sinon.restore());

  it("should create a new category if one does not exist", async () => {
    await handleServerJoin(guild);
    const stub = guild.channels.create as sinon.SinonStub;
    expect(stub.callCount).to.eql(2);
    expect(stub.calledWith({
      name: config.discord.channelCategory,
      type: ChannelType.GuildCategory
    })).to.be.true;
  });

  it("should create a new channel if one does not exist", async () => {
    // @ts-ignore
    guild.channels.cache = [{
      id: 1,
      name: config.discord.channelCategory,
      type: ChannelType.GuildCategory
    }];

    await handleServerJoin(guild);
    const stub = guild.channels.create as sinon.SinonStub;
    expect(stub.calledOnce).to.be.true;
    expect(stub.calledWith({
      name: config.discord.channel,
      type: ChannelType.GuildText,
      parent: 1,
      reason: constants.newChannelReason,
      topic: constants.newChannelReason,
    })).to.be.true;
  });

  it("should not create a new category if one already exists", async () => {
    // @ts-ignore
    guild.channels.cache = [{
      name: config.discord.channelCategory,
      type: ChannelType.GuildCategory,
    }];

    await handleServerJoin(guild);
    const stub = guild.channels.create as sinon.SinonStub;
    expect(stub.callCount).to.eql(1);
    expect(stub.calledWith({
      name: config.discord.channelCategory,
      type: ChannelType.GuildCategory
    })).to.be.false;
  });

  it("should not create a new channel if one already exists", async () => {
    // @ts-ignore
    guild.channels.cache = [{
      name: config.discord.channel,
      type: ChannelType.GuildText,
    }];

    await handleServerJoin(guild);
    const stub = guild.channels.create as sinon.SinonStub;
    expect(stub.callCount).to.eql(1);
    expect(stub.calledWith({
      name: config.discord.channel,
      type: ChannelType.GuildText
    })).to.be.false;
  });

  it("should send welcome message on channel creation", async () => {
    await handleServerJoin(guild);
    // @ts-ignore
    const stub = (await guild.channels.create({} as any)).send as sinon.SinonStub;
    expect(stub.callCount).to.eql(1);
    expect(stub.calledWith(constants.welcomeMessage)).to.be.true;
  });
});
