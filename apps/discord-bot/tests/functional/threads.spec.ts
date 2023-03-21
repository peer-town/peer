import chai, {expect} from "../setup";
import {initServer} from "../../src/core";
import {Express} from "express";

describe("thread api", () => {
  let server: Express;
  const url = "/api/web-thread";
  before(() => server = initServer({} as any));

  it("should validate the schema for request", async () => {
    const res = await chai.request(server).post(url);
    expect(res.status).to.eql(400);
    const another = await chai.request(server).post(url).send({threadId: 123});
    expect(another.status).to.eql(400);
  });
});
