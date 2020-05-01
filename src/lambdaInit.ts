import beginProcess from "./localInit";
import Utils from "./utils";
import logger from "./utils/logger";
module.exports = {
    async main(event, context) {
        try {
            logger.info(event.body);
            logger.info(context);
            await beginProcess(JSON.parse(event.body));
            logger.info("Done");
            return Utils.prepareResponse(200, "ok");
        } catch (error) {
            logger.error("Failed to process the event");
            return Utils.prepareResponse(500, "Internal errro");
        }
    }
};
