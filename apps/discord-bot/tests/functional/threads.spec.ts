import chai, {expect} from "../setup";
import {initServer} from "../../src/core";
import * as sinon from "sinon";
import {fakeComposeClient, fakeComposeQueryClient, fakeDiscordClient} from "../mock/fakes";
import {config} from "../../src/config";

describe("thread api", () => {
  const url = "/api/web-thread";
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
    const another = await chai.request(server).post(url).set(header).send({threadId: 123});
    expect(another.status).to.eql(400);
  });

  it("should respond with 200 on thread creation", async () => {
    const another = await chai.request(server).post(url).set(header).send({threadId: "123"});
    expect(another.status).to.eql(200);
  });
});
