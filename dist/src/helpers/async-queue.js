"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const request = require("request");
let q = async.queue(function (task, callback) {
    setTimeout(() => {
        request.post(task.request, function (error, response) {
            if (error) {
                callback(error);
            }
            else {
                callback(null, response);
            }
        });
    }, 1000);
}, 1);
q.drain = function () {
    console.log('Request(s) posted successfully');
};
exports.default = q;
//# sourceMappingURL=async-queue.js.map