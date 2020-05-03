import SnsService from "../src/services/snsService";
import * as Aws from "aws-sdk";
import * as sinon from "sinon";
import { expect } from "chai";
import testData from "../testData/index";
import EventEntity from "../src/entities/eventEntity";
import { EventAggregator } from "../src/eventAggregator";
import { Sequelize } from "sequelize-typescript";
import path = require("path");

const sequelize = new Sequelize({
    dialect: "mysql"
});
sequelize.addModels([path.join(__dirname, "../src/entities/*.ts")]);
sinon.stub(EventEntity, "build").returns(new EventEntity());
const event = EventEntity.build();
const eventStub = sinon.stub(event, "save");
const snsClient = new Aws.SNS();
const snsStub = sinon.stub(snsClient, "publish");
const eventAggregator = new EventAggregator(snsClient);
const snsServiceSpy = sinon.spy(SnsService.prototype, "pushEvent");
after(() => {
    eventStub.reset();
    snsStub.reset();
});
afterEach(() => {
    snsServiceSpy.restore();
});
describe("Event aggregator tests", () => {
    it("should resolve a promise when both of the operatins are successful", async () => {
        eventStub.resolves();
        snsStub.yields(null, "abcd");
        const result = await eventAggregator.startProcessing(testData["event-data"]);
        expect(result).equals(undefined);
        expect(snsServiceSpy.callCount).equal(1);
    });

    it("should resolve a promise even if message is not published", async () => {
        eventStub.resolves();
        snsStub.yields("error", null);
        const result = await eventAggregator.startProcessing(testData["event-data"]);
        expect(result).equals(undefined);
        expect(snsServiceSpy.callCount).equal(1);
    });

    it("should reject a promise and not publish a message if event is not persisted. ", async () => {
        eventStub.rejects();
        try {
            await eventAggregator.startProcessing(testData["event-data"]);
        } catch (error) {
            expect(error).instanceOf(Error);
            expect(snsServiceSpy.callCount).equal(1);
        }
    });
});
