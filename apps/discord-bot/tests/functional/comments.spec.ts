import chai, {expect} from "../setup";
import {initServer} from "../../src/core";
import {config, constants} from "../../src/config";
import * as sinon from "sinon";
import {fakeComposeClient, fakeComposeQueryClient, fakeDiscordClient, sendStub} from "../mock/fakes";

describe("comment api", () => {
  const url = "/api/web-comment";
  const header = {'x-api-key': config.server.apiKey};
  const server = initServer({
    discord: fakeDiscordClient,
    compose: fakeComposeClient,
    composeQuery: fakeComposeQueryClient,
  });

  beforeEach(() => sinon.restore());

  it("should authenticate the api call", async () => {
    const res = await chai.request(server).post(url);
    expect(res.status).to.eql(401);
  });

  it("should validate the schema for request", async () => {
    const res = await chai.request(server).post(url).set(header);
    expect(res.status).to.eql(400);
    const another = await chai.request(server).post(url).set(header).send({commentId: 123});
    expect(another.status).to.eql(400);
  });

  it("should response with 200 on sent message", async () => {
    const res = await chai.request(server).post(url).set(header).send({commentId: "123"});
    expect(res.status).to.eql(200);
    expect(sendStub).to.be.callCount(1);
    expect(res.body).to.eql({
      msg: "Created comment on socials",
      data: [{
        platformName: constants.PLATFORM_DISCORD_NAME,
        commentId: 1
      }]
    })
  });
});
