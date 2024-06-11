"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = exports.publish = exports.init = void 0;
const rabbitMQ = require("amqplib/callback_api");
const fs = require("fs");
const services_1 = require("src/services");
const connectionUrl = process.env.rabbitMQ_url || 'amqp://reach-local:R3achL0cal@192.168.59.135:5672/reach-local';
let delay = 1;
let [MS_NAME, HOST_NAME, AMQP_CONN, PUB_SUB_CHANNEL, CONNECTION_URL, OFFLINE_QUEUE] = [null, null, null, null, null, []];
const init = (msName, hostName, connectionURL) => {
    MS_NAME = msName;
    HOST_NAME = hostName;
    CONNECTION_URL = connectionURL;
    createConnection(CONNECTION_URL);
};
exports.init = init;
const createConnection = (connectionURL) => {
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
    }
    catch (conectionError) {
    }
};
const startPublisher = () => {
    AMQP_CONN.createConfirmChannel((err, channel) => {
        if (closeOnError(err)) {
            return;
        }
        channel.on("error", (err) => {
            logger("RabbitMQ channel error", err);
        });
        channel.on("close", () => {
            logger("RabbitMQ channel closed", { error: "RabbitMQ channel closed" });
        });
        PUB_SUB_CHANNEL = channel;
    });
};
const publish = (unused, queueName, content, callback) => {
    content.publisher = MS_NAME;
    content.hostName = HOST_NAME;
    content = Buffer.from(JSON.stringify(content));
    try {
        PUB_SUB_CHANNEL.publish('', queueName, content, { persistent: true }, (err, ok) => {
            if (err) {
                logger("RabbitMQ Publish error", err);
                OFFLINE_QUEUE.push([queueName, content]);
                PUB_SUB_CHANNEL.connection.close();
                callback(err);
            }
            else {
                callback(null, true);
            }
        });
    }
    catch (e) {
        OFFLINE_QUEUE.push([queueName, content]);
        logger("RabbitMQ Publish error", e);
        if (PUB_SUB_CHANNEL) {
            PUB_SUB_CHANNEL.connection.close();
        }
        callback(e);
    }
};
exports.publish = publish;
const subscribe = (unused, queueName, callback) => {
    if (!AMQP_CONN) {
        setTimeout(() => {
            (0, exports.subscribe)(unused, queueName, callback);
        }, 1500);
    }
    else {
        AMQP_CONN.createChannel((err, channel) => {
            if (closeOnError(err)) {
                return;
            }
            channel.on("error", (err) => {
                logger("RabbitMQ channel error", err);
            });
            channel.on("close", () => {
                logger("RabbitMQ channel closed", { error: "RabbitMQ channel closed" });
            });
            channel.assertQueue(queueName, { durable: true }, (err, _ok) => {
                if (closeOnError(err)) {
                    return;
                }
                channel.consume(queueName, processMsg, { noAck: false });
            });
            function processMsg(message) {
                if (message) {
                    let subscribedMessage = null;
                    try {
                        subscribedMessage = JSON.parse(message.content.toString());
                        channel.ack(message);
                        callback(null, subscribedMessage);
                    }
                    catch (error) {
                        channel.reject(message, true);
                        closeOnError(error);
                        callback(error);
                    }
                }
            }
        });
    }
};
exports.subscribe = subscribe;
const closeOnError = (err) => {
    if (!err) {
        return false;
    }
    logger("RabbitMQ close on error - ", err);
    if (AMQP_CONN)
        AMQP_CONN.close();
    return true;
};
const logger = (message, error) => {
    if (error) {
        let msg = `${message}: ${error.message}`;
        setTimeout(() => {
            services_1.Logger.warn(msg, error === null || error === void 0 ? void 0 : error.toString());
        }, delay);
        delay += 1000;
    }
};
const loadOfflineLogs = (done) => {
    const filename = `${__dirname}/../../../uncaught-errors.json`;
    fs.exists(filename, (exists) => {
        if (exists) {
            fs.readFile(filename, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    data = JSON.parse(data);
                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(log => {
                            OFFLINE_QUEUE.push(["traLogs", log]);
                        });
                        fs.unlinkSync(filename);
                        return done();
                    }
                    else {
                        return done();
                    }
                }
            });
        }
        else {
            return done();
        }
    });
};
const clearOfflineQueue = () => {
    let count = OFFLINE_QUEUE.length;
    while (true) {
        let m = OFFLINE_QUEUE.shift();
        if (!m)
            break;
        let [queueName, content] = m;
        (0, exports.publish)(null, queueName, content, () => { });
    }
    console.log(`Found ${count} offline log(s). All published to RabbitMQ!`);
};
//# sourceMappingURL=message-queue.js.map