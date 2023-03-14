import * as utils from "./index";

describe("utils.text", () => {
  const walletAddress = "0x7c98C2DEc5038f00A2cbe8b7A64089f9c0b51991";
  const did = "did:key:z6MkixfwpXXY7twhzufYhd8UD6rYYDpWRAwTj7xFxnxsjhdA";

  it("should return a formatted wallet address", () => {
    const output = "0x7c98...1991"
    expect(utils.formatWalletAddress(walletAddress)).toEqual(output);
    expect(utils.formatWalletAddress(undefined)).toEqual("");
    expect(utils.formatWalletAddress(null)).toEqual("");
  });

  it("should return a formatted did session/id", () => {
    const output = "z6Mk...jhdA"
    expect(utils.formatDid(did)).toEqual(output);
  });

  it("should return concatenation of class names", () => {
    expect(utils.classNames("a", "b", "custom")).toEqual("a b custom");
    expect(utils.classNames("a", null, undefined, "b", "c")).toEqual("a b c");
  });
});

describe("utils.discord", () => {

  it("should return auth url", () => {
    expect(utils.getDiscordAuthUrl()).not.toBeNull();
  });

  it("should return discord username structure", () => {
    expect(utils.getDiscordUsername("abc", "123")).toEqual("abc#123");
  });

  it("should return discord avatar url", () => {
    const expected = "https://cdn.discordapp.com/avatars/123/4567.jpg";
    expect(utils.getDiscordAvatarUrl("123", "4567")).toEqual(expected);
  });
});
