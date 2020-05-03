import SnsService from "../src/services/snsService";
import * as Aws from "aws-sdk";
import * as sinon from "sinon";
import { expect } from "chai";
import testData from "../testData/index";

const snsClient = new Aws.SNS();
const snsService = new SnsService(snsClient);
const snsStub = sinon.stub(snsClient, "publish");

after(() => {
    snsStub.reset();
});
describe("Sns service tests", () => {
    it("Should resolve a promise when publish message operation is successful.", async () => {
        snsStub.yields(null, "abcd");
        const result = await snsService.pushEvent(testData["event-data"]);
        expect(result).equal(undefined);
    });

    it("Should reject a promise if message is not published", async () => {
        snsStub.yields("abcd", null);
        try {
            await snsService.pushEvent(testData["event-data"]);
        } catch (error) {
            expect(error).equal(undefined);
        }
    });
});
