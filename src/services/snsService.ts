import { ResourceLoader } from "../config";
import { EventData, MessageHeader, SnsMessage } from "../utils/interface";
import logger from "../utils/logger";
import * as Aws from "aws-sdk";

class SnsService {
    private snsClient: Aws.SNS;
    constructor(snsClinet: Aws.SNS) {
        this.snsClient = snsClinet;
    }

    public pushEvent(eventData: EventData): Promise<undefined> {
        const message: string = this.prepareMessage(eventData);
        return new Promise((resolve, reject) => {
            this.snsClient.publish(
                {
                    Message: message,
                    TopicArn: ResourceLoader.getKey("aws:sns:arn"),
                    MessageStructure: "string"
                },
                (error, response: Aws.SNS.PublishResponse) => {
                    if (error) {
                        logger.error("Failed to publish event to sns topic");
                        logger.error(error.toString());
                        return reject();
                    }
                    logger.info("Event successfully published. Message id: " + response.MessageId);
                    return resolve();
                }
            );
        });
    }

    private prepareMessage(eventData: EventData) {
        const messageHeader: MessageHeader = eventData.message.headers;
        const message: SnsMessage = {
            messageId: messageHeader["message-id"],
            recipientDomain: eventData["recipient-domain"],
            subject: messageHeader.subject,
            recipinet: eventData.recipient,
            type: eventData.event
        };
        return JSON.stringify(message);
    }
}
export default SnsService;
