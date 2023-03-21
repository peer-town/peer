import {Express} from "express";
import {initServer} from "../../src/core";
import chai, {expect} from "../setup";

describe("ping api", () => {
  let server: Express;
  before(() => server = initServer({} as any));
  it("should respond with pong on call", async () => {
    const res = await chai.request(server).get("/api/ping");
    expect(res).to.have.status(200);
    expect(res.text).to.eql("pong");
  });
});
