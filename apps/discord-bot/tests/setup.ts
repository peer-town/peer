// @ts-ignore
import chai from "chai";
// @ts-ignore
import chaiHttp from "chai-http";

chai.use(chaiHttp);
export const expect = chai.expect;
export default chai;

// use this in other file as
// import chai, {expect} from "setup";
