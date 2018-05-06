import Worker from "worker-loader!@/worker/villageAnalyzer";

const worker = new Worker();

let guid = 0;
const store = new Map();

function task(action, data) {
    const id = guid++;
    const deffered = {};
    const promise = new Promise((success, error) => {
        deffered.resolve = success;
        deffered.reject = error;
    });
    store.set(id, deffered);

    worker.postMessage({ action, id, data });

    return promise;
}

function onMessage({data: {id, error, data}}) {
    const method = error ? 'reject' : 'resolve';
    store.get(id)[method](data);
    store.delete(id);
}

worker.onmessage = onMessage;

export default task;