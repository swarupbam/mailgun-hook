import beginProcess from "../src/localInit";
import { Sequelize } from "sequelize-typescript";
import sinon = require("sinon");
import { expect } from "chai";
import testData from "../testData";

const sequelizeStub = sinon.stub(Sequelize.prototype, "authenticate");

after(() => {
    sequelizeStub.reset();
});

describe("localInit tests", () => {
    it("should not start processing if there is an error while initialising resources", async () => {
        sequelizeStub.rejects();
        try {
            await beginProcess(testData);
        } catch (errror) {
            expect(errror).instanceOf(Error);
        }
    });
});
