import chai, {expect} from "../setup";
import {initServer} from "../../src/core";
import {Express} from "express";
import {fakeComposeClient, fakeComposeQueryClient, fakeDiscordClient} from "../mock/fakes";
import {config} from "../../src/config";

describe("comment api", () => {
  let server: Express;
  const url = "/api/web-comment";
  const header = {'x-api-key': config.server.apiKey};

  before(() => {
    server = initServer({
      discord: fakeDiscordClient,
      compose: fakeComposeClient,
      composeQuery: fakeComposeQueryClient,
    });
  });

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
  });
});
