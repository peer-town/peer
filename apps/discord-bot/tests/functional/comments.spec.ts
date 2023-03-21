import chai, {expect} from "../setup";
import {initServer} from "../../src/core";
import {Express} from "express";

describe("comment api", () => {
  let server: Express;
  const url = "/api/web-comment";
  before(() => server = initServer({} as any));

  it("should valid the schema for request", async () => {
    const res = await chai.request(server).post(url);
    expect(res.status).to.eql(401);

    const another = await chai.request(server).post(url).send({commentId: 123});
    expect(another.status).to.eql(401);
  });
});
