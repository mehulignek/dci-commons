import * as async from 'async';
import * as request from 'request';

interface Task {
    request: request.CoreOptions & request.UrlOptions;
}

/*
    async queue for sending failure requests to the respected server(s)
*/
let q = async.queue(function (task: Task, callback: (error: any, response?: request.Response) => void) {
    setTimeout(() => {
        request.post(task.request, function (error, response) {
            if (error) {
                callback(error);
            } else {
                callback(null, response);
            }
        });
    }, 1000);
}, 1);

/*
    this function will be called when the queue is drained.
*/
q.drain = function () {
    console.log('Request(s) posted successfully');
};

export default q;
