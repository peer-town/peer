import * as utils from "./index";
import {isRight, left, right} from "./fp";

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
    expect(utils.getDiscordAuthUrl('user')).not.toBeNull();
    expect(utils.getDiscordAuthUrl('community')).not.toBeNull();
  });

  it("should return discord username structure", () => {
    expect(utils.getDiscordUsername("abc", "123")).toEqual("abc#123");
  });

  it("should return discord avatar url", () => {
    const expected = "https://cdn.discordapp.com/avatars/123/4567.jpg";
    const expectedCommunity = "https://cdn.discordapp.com/icons/123/4567.png";
    expect(utils.getDiscordAvatarUrl("123", "4567")).toEqual(expected);
    expect(utils.getCommunityDiscordAvatarUrl("123", "4567")).toEqual(expectedCommunity);
  });
});

describe("utils.fp", () => {
  it("should identify left type of either", () => {
    const lefty = left("sample");
    expect(lefty).toEqual({tag: "left", value: "sample"});
    expect(isRight(lefty)).toBeFalsy();
  });

  it("should identify right type of either", () => {
    const righty = right("sample");
    expect(righty).toEqual({tag: "right", value: "sample"});
    expect(isRight(righty)).toBeTruthy();
  });
});

describe("utils.number", () => {
  it("should convert valid numbers to formatted values", () => {
    expect(utils.formatNumber(1)).toEqual("1");
    expect(utils.formatNumber(10)).toEqual("10");
    expect(utils.formatNumber(1000)).toEqual("1K");
    expect(utils.formatNumber(1000000)).toEqual("1M");
  });

  it("should handler invalid values in format number", () => {
    expect(utils.formatNumber('1' as any)).toEqual("1");
    expect(utils.formatNumber('10' as any)).toEqual("10");
    expect(utils.formatNumber(undefined)).toEqual("0");
    expect(utils.formatNumber(null)).toEqual("0");
  });

  it("should handler number conversion", () => {
    expect(utils.convertToNumber("1")).toEqual(1);
    expect(utils.convertToNumber(1)).toEqual(1);
    expect(utils.convertToNumber("21a")).toEqual(21);
    expect(utils.convertToNumber(undefined)).toEqual(0);
    expect(utils.convertToNumber(null)).toEqual(0);
    expect(utils.convertToNumber('undefined')).toEqual(0);
    expect(utils.convertToNumber('null')).toEqual(0);
    expect(utils.convertToNumber(NaN)).toEqual(0);
    expect(utils.convertToNumber('NaN')).toEqual(0);
  });
});

describe("utils.data", () => {
  it("should return 0 if data is undefined or null", () => {
    expect(utils.getAbsVotes(undefined)).toEqual(0);
    expect(utils.getAbsVotes(null)).toEqual(0);
    expect(utils.getAbsVotes({edges: []})).toEqual(0);
  });

  it("should return positive for more upvotes and less downvotes", () => {
    const data = {
      edges: [
        {node: {vote: true}},
        {node: {vote: true}},
        {node: {vote: false}},
      ]
    }
    expect(utils.getAbsVotes(data as any)).toEqual(1);
  });

  it("should return negative for less upvotes and more downvotes", () => {
    const data = {
      edges: [
        {node: {vote: true}},
        {node: {vote: false}},
        {node: {vote: false}},
      ]
    }
    expect(utils.getAbsVotes(data as any)).toEqual(-1);
  });
});
