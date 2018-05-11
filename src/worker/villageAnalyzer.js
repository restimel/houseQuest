import { access } from "fs";

self.onmessage = ({ data: { id, action, data } }) => {
    const result = {
        id: id,
        error: false,
        data: null,
    };
    doAction(action, data, result);
    self.postMessage(result);
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

function analyze({maze, starts, ends}) {
    function getId(x, y) {
        return `${x}, ${y}`;
    }
    function getCell(x, y) {
        return maze[x] && maze[x][y] || {
            u: false,
            d: false,
            r: false,
            l: false,
        }
    }
    function computeCell(x, y, dist, parent, dir) {
        const id = getId(x, y);
        if (accessible.has(id)) {
            return;
        }
        const cell = cells[x] && cells[x][y];
        if (!cell) {
            return;
        }
        cell.dist = dist;
        cell.parent = parent;
        cell.dirParent = dir;
        accessible.add(id);
    }
    function computeSibling(x, y) {
        const id = getId(x ,y);
        let cell = maze[x] && maze[x][y];
        let dist;
        if (!cell) {
            dist = 1;
            cell = {
                u: getCell(x, y - 1).d,
                d: getCell(x, y + 1).u,
                r: getCell(x + 1, y - 1).l,
                l: getCell(x - 1, y).r,
            };
        } else {
            dist = cells[x][y].dist + 1;
        }

        if (cell.u) {
            computeCell(x, y-1, dist, id, 'd');
        }
        if (cell.d) {
            computeCell(x, y+1, dist, id, 'u');
        }
        if (cell.r) {
            computeCell(x+1, y, dist, id, 'l');
        }
        if (cell.l) {
            computeCell(x-1, y, dist, id, 'r');
        }
    }

    const dbg = performance.now();
    const accessible = new Set();

    /* prepare a state for all cells to store distance and best direction */
    const mazeW = maze.length;
    const cells = new Array(mazeW);
    for (let x = 0; x < mazeW; x++) {
        const mazeX = maze[x];
        const mazeH = mazeX.length;
        cells[x] = new Array(mazeH);
        for (let y = 0; y < mazeH; y++) {
            // cells initialization
            cells[x][y] = {
                dist: Infinity,
                orientation: '',
                parent: NaN,
                dirParent: '',
            };
        }
    }

    /* check for all available cells */
    starts.forEach(start => accessible.add(start));

    accessible.forEach(cell => {
        const [x, y] = cell.split(', ').map(x => +x);
        computeSibling(x, y);
    });

    /* greedy algorithm to compute directions */

    let shortestPathLength = Infinity;
    let lastCell;
    let dir;
    ends.forEach(end => {
        const [x, y] = end.split(', ').map(x => +x);
        let dist = (cells[x+1] && cells[x+1][y] || {dist: Infinity}).dist;
        if (dist < shortestPathLength) {
            shortestPathLength = dist;
            lastCell = getId (x+1, y);
            //dir is in opposite direction to match the "parent direction"
            dir = 'r';
        }
        dist = (cells[x-1] && cells[x-1][y] || {dist: Infinity}).dist;
        if (dist < shortestPathLength) {
            shortestPathLength = dist;
            lastCell = getId(x - 1, y);
            dir = 'l';
        }
        dist = (cells[x] && cells[x][y+1] || {dist: Infinity}).dist;
        if (dist < shortestPathLength) {
            shortestPathLength = dist;
            lastCell = getId(x, y + 1);
            dir = 'd';
        }
        dist = (cells[x] && cells[x][y-1] || {dist: Infinity}).dist;
        if (dist < shortestPathLength) {
            shortestPathLength = dist;
            lastCell = getId(x, y - 1);
            dir = 'u';
        }
    });

    let dist = shortestPathLength;
    do {
        const [x, y] = lastCell.split(', ').map(x => +x);
        const cell = cells[x][y];
        cell.orientation = '-' + dir;
        dir = cell.dirParent;
        lastCell = cell.parent;
        dist = cell.dist;
    } while(dist > 1);

    console.log(performance.now() - dbg);
    return {
        nbCellAccessible: accessible.size,
        nbShortestPath: shortestPathLength,
        cells: cells,
    };
}
