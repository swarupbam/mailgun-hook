import { EventData, MessageHeader } from "./utils/interface";
import EventEntity from "./entities/eventEntity";
import logger from "./utils/logger";
import SnsService from "./services/snsService";

export class EventAggregator {
    private snsService: SnsService;
    constructor() {
        // dependency injection?
        this.snsService = new SnsService();
    }
    public startProcessing(eventData: EventData): Promise<undefined> {
        return new Promise((resolve, reject) => {
            this.persistEvent(eventData)
                .then(() => this.publishEventToSnsTopic(eventData))
                .catch(reject)
                .then(() => resolve());
        });
    }

    public async persistEvent(eventData: EventData): Promise<EventEntity | Error> {
        try {
            const messageHeader: MessageHeader = eventData.message.headers;
            const event: EventEntity = EventEntity.build({
                messageId: messageHeader["message-id"],
                recipientDomain: eventData["recipient-domain"],
                recipient: eventData.recipient,
                type: eventData.event,
                subject: messageHeader.subject
            });
            const response: EventEntity = await event.save();
            logger.info("Event persisted successfully");
            return response;
        } catch (error) {
            logger.error("Failed to persist event.");
            logger.error(error.toString());
            throw error;
        }
    }

    public async publishEventToSnsTopic(eventData: EventData) {
        try {
            return await this.snsService.pushEvent(eventData);
        } catch (error) {
            return;
        }
    }
}
