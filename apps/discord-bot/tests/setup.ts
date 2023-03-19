// @ts-ignore
import chai from "chai";
// @ts-ignore
import chaiHttp from "chai-http";
// @ts-ignore
import chaiSpies from "chai-spies";
// @ts-ignore
import sinonChai from "sinon-chai";
// @ts-ignore
import chaiAsPromised from "chai-as-promised";

chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiSpies);
chai.use(chaiAsPromised);
export const expect = chai.expect;
export default chai;

// use this in other file as
// import chai, {expect} from "setup";
