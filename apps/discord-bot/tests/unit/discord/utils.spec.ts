import {expect} from "../../setup";
import {buildLinkButton, buildMessage, buildThread, buildUserEmbed} from "../../../src/bots/discord/utils";

describe("discord.utils", () => {
  const message = {
    body: "some body",
    userAvatar: "https://some.com",
    redirectLink: "https://some.com",
    userName: "some user",
    userProfileLink: "https://some.com",
  };

  it("should build thread", () => {
    expect(buildThread("some title")).to.not.throw;
  });

  it("should build message", () => {
    expect(buildMessage(message)).to.not.throw;
  });

  it("should build user embed", () => {
    expect(buildUserEmbed(
      message.userName,
      message.body,
      message.userAvatar,
      message.userProfileLink
    )).to.not.throw;
  });

  it("should build a link button", () => {
    expect(buildLinkButton(message.redirectLink)).to.not.throw;
  });
});
