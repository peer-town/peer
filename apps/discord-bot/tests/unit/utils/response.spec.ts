import {expect} from '../../setup';
import {Response} from 'express';
import * as sinon from 'sinon';
import {Resp} from "../../../src/core/utils/response";

describe('Resp', () => {
  let res: Response;

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      end: sinon.stub(),
    } as unknown as Response;
  });

  it('should send a 200 response with the given message', () => {
    const message = 'test message';
    Resp.ok(res, message);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({msg: message});
    expect(res.end).to.have.been.calledOnce;
  });

  it('should send a 401 response with the given message', () => {
    const message = 'test message';
    Resp.notOk(res, message);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith({msg: message});
    expect(res.end).to.have.been.calledOnce;
  });

  it('should send a 500 response with the given message', () => {
    const message = 'test message';
    Resp.error(res, message);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({msg: message});
    expect(res.end).to.have.been.calledOnce;
  });

  it('should send a 200 response with the given message and data', () => {
    const message = 'test message';
    const data = { data: 'data' };
    Resp.okD(res, data, message);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({msg: message, data: data});
    expect(res.end).to.have.been.calledOnce;
  });
});
