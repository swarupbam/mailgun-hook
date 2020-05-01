import beginProcess from "./localInit";
import logger from "./utils/logger";
const body: string = JSON.stringify({
    signature: {
        timestamp: "1587212375651",
        token: "05c9b12483525227e22d0c83b29ccf5f884f791c869bf9cb59e2",
        signature: "440d61004873c123112d67482c77c7cba2f7996199b2e5995b60d1c64aa7fd19e271c"
    },
    "event-data": {
        message: {
            headers: {
                to: "abcd@gmail.com",
                "message-id": "1111111",
                from: "12313131@mailgun",
                subject: "attachment test"
            }
        },
        recipient: "abcd@gmail.com",
        event: "delivered",
        "recipient-domain": "gmail.com"
    }
});

beginProcess(JSON.parse(body))
    .then(() => logger.info("Done"))
    .catch(() => logger.error("Failed to process the event"));
