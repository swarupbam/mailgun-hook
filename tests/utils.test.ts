import Utils from "../src/utils";
import { expect } from "chai";

describe("Utils tests", () => {
    it("should prepare approapriate response based on the arguments", () => {
        expect(Utils.prepareResponse(200, "ok")).to.deep.equal({ statusCode: 200, body: "ok" });
    });
});
