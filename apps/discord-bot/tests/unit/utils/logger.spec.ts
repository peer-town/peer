import { expect } from '../../setup';
import {logger} from "../../../src/core/utils/logger";
import * as sinon from 'sinon';

describe('log()', () => {
  afterEach(() => sinon.restore());

  it('should log a string message', () => {
    const spy = sinon.spy(console, 'log');
    logger.info('test', 'hello world');
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.include('[INFO] [core] \nhello world');
  });

  it('should log an Error object with a stack trace', () => {
    const spy = sinon.spy(console, 'log');
    const error = new Error('something went wrong');
    logger.error('test', error);
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.include('[ERROR] [core] \n{"name":"Error","message":"something went wrong","stack":');
  });

  it('should log an object containing an Error object with a stack trace', () => {
    const spy = sinon.spy(console, 'log');
    const message = { e: new Error('something went wrong'), data: { s: 'a' } };
    logger.debug('test', message);
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.include('"data":{"s":"a"}}');
  });
});
