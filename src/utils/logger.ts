import winston from "winston";

const logger = winston.createLogger({
    format: winston.format.json(),
    level: "info" // TODO: accept this from env,
});

export default logger;