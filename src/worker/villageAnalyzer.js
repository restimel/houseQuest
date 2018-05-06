
self.onmessage = ({ data: { id, action, data } }) => {
    doAction(action, data, {
        id: id,
        error: false,
        data: null,
    })
    self.postMessage({ text: text + text + Test.message });
};

function doAction(action, data, result) {
    switch (action) {
        case 'analyze':
            result.data = analyze(data);
            break;
        default:
            result.error = true;
            result.data = 'Action "' + action + '" is not implemented.';
    }
}

function analyze(maze) {
    return {
        length: maze.length,
    };
}
