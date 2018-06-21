import Worker from "worker-loader!@/worker/villageAnalyzer";

const worker = new Worker();

let guid = 0;
const workerStore = new Map();
const workerProgress = new Map();

function task(action, data, progressCallback) {
    const id = guid++;
    const deffered = {};
    const promise = new Promise((success, error) => {
        deffered.resolve = success;
        deffered.reject = error;
    });
    workerStore.set(id, deffered);

    if (progressCallback) {
        workerProgress.set(id, progressCallback);
    }

    worker.postMessage({ action, id, data });

    return promise;
}

function onMessage({data: {id, error, data, finished}}) {
    if (finished || !workerProgress.has(id)) {
        const method = error ? 'reject' : 'resolve';
        workerStore.get(id)[method](data);
        workerStore.delete(id);
        workerProgress.delete(id);
    } else {
        workerProgress.get(id)(data);
    }
}

worker.onmessage = onMessage;

export default task;