import { ResourceLoader } from "./config/index";
import { EventAggregator } from "./eventAggregator";
import logger from "./utils/logger";
import { EventPayload } from "./utils/interface";

async function beginProcess(eventPayload: EventPayload) {
    try {
        try {
            await ResourceLoader.bootstrap();
        } catch (bootstrapError) {
            logger.error("Failed to initialise the resources");
            logger.error(bootstrapError.toString());
            throw bootstrapError;
        }
        return await new EventAggregator().startProcessing(eventPayload["event-data"]);
    } catch (error) {
        throw error;
    }
}

export default beginProcess;
