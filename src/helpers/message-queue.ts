import * as rabbitMQ from 'amqplib/callback_api';
import * as fs from 'fs';
import { Logger } from 'src/services';

const connectionUrl = process.env.rabbitMQ_url || 'amqp://reach-local:R3achL0cal@192.168.59.135:5672/reach-local';

let delay = 1;

let [MS_NAME, HOST_NAME, AMQP_CONN, PUB_SUB_CHANNEL, CONNECTION_URL, OFFLINE_QUEUE] = [null, null, null, null, null, []] as any;

/**
 * Init the process
 * 
 * @param {string} msName - Name of the microservice
 * @param {string} hostName - Hostname required to log the access
 * @param {string} connectionURL - Connection string
 * @return void
 */
export const init = (msName: string, hostName: string, connectionURL: string): void => {
    MS_NAME = msName;
    HOST_NAME = hostName;
    CONNECTION_URL = connectionURL;
    createConnection(CONNECTION_URL);
};

/**
 * Create the connection
 * @param {string} connectionURL - connection string
 * @return void
 */
const createConnection = (connectionURL: string): void => {
    try {
        rabbitMQ.connect(connectionURL + "?heartbeat=60", (error, connection) => {
            if (error) {
                logger("RabbitMQ Connection Error", error);
                return setTimeout(() => createConnection(connectionURL), 3000);
            }

            connection.on("error", function (err) {
                if (err.message !== "Connection closing") {
                    logger("RabbitMQ Connection Error", err);
                }
            });

            connection.on("close", function () {
                logger("RabbitMQ reconnecting", { message: "RabbitMQ Closed and Reconnecting.." });
                return setTimeout(() => createConnection(connectionURL), 3000);
            });

            console.log("RabbitMQ Connected");
            AMQP_CONN = connection;
            startPublisher();
        });
    } catch (conectionError) {
        // logger("RabbitMQ reconnecting", { message: "RabbitMQ Closed and Reconnecting.." });
        // return setTimeout(createConnection, 3000);
    }
};

/**
 * We need publisher in all the MS, so we will start publisher once MS starts
 * 
 * @return void
 */
const startPublisher = (): void => {
    AMQP_CONN.createConfirmChannel((err, channel) => {
        if (closeOnError(err)) { return; }

        channel.on("error", (err) => {
            logger("RabbitMQ channel error", err);
        });

        channel.on("close", () => {
            logger("RabbitMQ channel closed", { error: "RabbitMQ channel closed" });
        });

        PUB_SUB_CHANNEL = channel;
    });
};

/**
 * Publish the message(s) into provided queue
 * @param {string} connectionUrl - connection string
 * @param {string} queueName - Name of the queue to publish the message.
 * @param {any} content - Content to be published.
 * @param {function} callback - callback function
 * @return void
 */
export const publish = (unused: any, queueName: string, content: any, callback: (err: any, result?: boolean) => void): void => {
    // Add microservice name to each message before publishing
    content.publisher = MS_NAME;
    content.hostName = HOST_NAME;
    content = Buffer.from(JSON.stringify(content));

    try {
        PUB_SUB_CHANNEL.publish('', queueName, content, { persistent: true },
            (err, ok) => {
                if (err) {
                    logger("RabbitMQ Publish error", err);
                    OFFLINE_QUEUE.push([queueName, content]);
                    PUB_SUB_CHANNEL.connection.close();
                    callback(err);
                } else {
                    callback(null, true);
                }
            });
    } catch (e) {
        OFFLINE_QUEUE.push([queueName, content]);
        logger("RabbitMQ Publish error", e);
        if (PUB_SUB_CHANNEL) {
            PUB_SUB_CHANNEL.connection.close();
        }
        callback(e);
    }
}

/**
 * Subscribe into queue to get message(s)
 * 
 * @param {string} connectionUrl - Connection string
 * @param {string} queueName - Name of the queue to get the message.
 * @param {function} callback - Callback function
 * @return void
 */
export const subscribe = (unused: any, queueName: string, callback: (err: any, message?: any) => void): void => {
    if (!AMQP_CONN) {
        setTimeout(() => {
            subscribe(unused, queueName, callback);
        }, 1500);
    } else {
        AMQP_CONN.createChannel((err, channel) => {
            if (closeOnError(err)) { return; }

            channel.on("error", (err) => {
                logger("RabbitMQ channel error", err);
            });

            channel.on("close", () => {
                logger("RabbitMQ channel closed", { error: "RabbitMQ channel closed" });
            });

            channel.assertQueue(queueName, { durable: true }, (err, _ok) => {
                if (closeOnError(err)) { return; }

                channel.consume(queueName, processMsg, { noAck: false });
            });

            // Message Handler
            function processMsg(message: rabbitMQ.Message | null) {
                if (message) {
                    let subscribedMessage: any = null;
                    try {
                        subscribedMessage = JSON.parse(message.content.toString());
                        channel.ack(message);
                        callback(null, subscribedMessage);
                    } catch (error) {
                        channel.reject(message, true);
                        closeOnError(error);
                        callback(error);
                    }
                }
            }
        });
    }
}

/**
 * Release the connection if failure
 *
 * @param {object} err - Error object.
 * @return void
 */
const closeOnError = (err: any): boolean => {
    if (!err) { return false; }
    logger("RabbitMQ close on error - ", err);
    if (AMQP_CONN) AMQP_CONN.close();
    return true;
}

const logger = (message: string, error: any): void => {
    if (error) {
        let msg = `${message}: ${error.message}`;
        setTimeout(() => {
            Logger.warn(msg, error?.toString());
        }, delay);

        delay += 1000;
    }
}

const loadOfflineLogs = (done: () => void): void => {
    // Logging the exception to the file
    const filename = `${__dirname}/../../../uncaught-errors.json`;

    fs.exists(filename, (exists) => {
        if (exists) {
            fs.readFile(filename, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    data = JSON.parse(data); // now it's an object
                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(log => {
                            OFFLINE_QUEUE.push(["traLogs", log]);
                        });

                        fs.unlinkSync(filename);
                        return done();
                    } else {
                        return done();
                    }
                }
            });
        } else {
            return done();
        }
    });
}
const clearOfflineQueue = (): void => {
    let count = OFFLINE_QUEUE.length;
    while (true) {
        let m = OFFLINE_QUEUE.shift();
        if (!m) break;
        let [queueName, content] = m;
        publish(null, queueName, content, () => { });
    }

    console.log(`Found ${count} offline log(s). All published to RabbitMQ!`);
}
