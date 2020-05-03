import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import logger from "../utils/logger";
import * as nconf from "nconf";
import * as path from "path";
import * as Aws from "aws-sdk";

export class ResourceLoader {
    private static sequelizeClient: Sequelize;
    private static snsClient: Aws.SNS;

    public static getKey(key: string) {
        return nconf.get(key);
    }

    private static initNconf() {
        nconf
            .argv()
            .env("__")
            .file({ file: path.join(__dirname, "/appConfig.json") });
    }
    private static initSnsClient() {
        this.snsClient = new Aws.SNS({
            accessKeyId: this.getKey("aws:accessKey"),
            secretAccessKey: this.getKey("aws:secretAccessKey"),
            apiVersion: this.getKey("aws:sns:apiVersion"),
            region: this.getKey("aws:region")
        });
    }

    private static async initSequelize(): Promise<void> {
        try {
            const dbConfig: SequelizeOptions = {
                database: nconf.get("db:name"),
                username: nconf.get("db:userName"),
                password: nconf.get("db:password"),
                host: nconf.get("db:host"),
                port: nconf.get("db:port"),
                dialectOptions: {
                    multipleStatements: true
                },
                logging: false,
                dialect: nconf.get("db:dialect"),
                pool: {
                    max: 1,
                    min: 1,
                    idle: 1000
                },
                typeValidation: true
            };
            logger.info("Connecting to Database");
            this.sequelizeClient = new Sequelize(dbConfig);
            await this.sequelizeClient.authenticate();
            logger.info("Connected successfully");
            logger.info("Loading entities");
            this.sequelizeClient.addModels([
                path.join(__dirname, "../entities/*.js"),
                path.join(__dirname, "../entities/*.ts")
            ]);
            logger.info("All entities loaded successfully");
        } catch (error) {
            logger.error("Error while connecting to database");
            throw error;
        }
    }

    private static disableConnectionPool() {
        Sequelize.addHook("afterInit", (sequelize: any) => {
            if (sequelize.connectionManager.pool) {
                sequelize.options.handleDisconnects = false;

                // Disable pool completely
                sequelize.connectionManager.pool.drain();
                sequelize.connectionManager.pool = null;
                sequelize.connectionManager.getConnection = function getConnection() {
                    return this._connect(sequelize.config);
                };
                sequelize.connectionManager.releaseConnection = function releaseConnection(connection) {
                    return this._disconnect(connection);
                };
            }
        });
    }

    public static getSnsClient(): Aws.SNS {
        return this.snsClient;
    }

    public static async bootstrap(): Promise<void> {
        try {
            ResourceLoader.disableConnectionPool();
            ResourceLoader.initNconf();
            ResourceLoader.initSnsClient();
            return await ResourceLoader.initSequelize();
        } catch (error) {
            throw error;
        }
    }
}
