import {Express} from "express";
import {initServer} from "../../src/core";
import chai, {expect} from "../setup";
import {config} from "../../src/config";

describe("ping api", () => {
  let server: Express;
  const header = {'x-api-key': config.server.apiKey};

  before(() => server = initServer({} as any));

  it("should authenticate the call", async () => {
    const res = await chai.request(server).get("/api/ping");
    expect(res).to.have.status(401);
  });

  it("should respond with pong on call", async () => {
    const res = await chai.request(server).get("/api/ping").set(header);
    expect(res).to.have.status(200);
    expect(res.text).to.eql("pong");
  });
});
