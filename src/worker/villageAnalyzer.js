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

const emptyCell = {
    u: false,
    d: false,
    r: false,
    l: false,
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
        return maze[x] && maze[x][y] || emptyCell;
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
        accessible.set(id, [x, y]);
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

    function computeDirections() {
        let lastCell;
        let dir;
        let shortestPathLength = Infinity;

        ends.forEach(end => {
            let dist;
            const [x, y] = end.split(', ').map(x => +x);

            if (getCell(x + 1, y).l) {
                dist =  cells[x + 1][y].dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x + 1, y);
                    //dir is in opposite direction to match the "parent direction"
                    dir = 'r';
                }
            }

            if (getCell(x - 1, y).r) {
                dist = cells[x - 1][y].dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x - 1, y);
                    dir = 'l';
                }
            }

            if (getCell(x, y + 1).u) {
                dist = cells[x][y + 1].dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x, y + 1);
                    dir = 'd';
                }
            }

            if (getCell(x, y - 1).d) {
                dist = cells[x][y - 1].dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x, y - 1);
                    dir = 'u';
                }
            }
        });

        if (isFinite(shortestPathLength)) {
            let dist = shortestPathLength;
            do {
                const [x, y] = lastCell.split(', ').map(x => +x);
                const cell = cells[x][y];
                cell.orientation = '-' + dir;
                dir = cell.dirParent;
                lastCell = cell.parent;
                dist = cell.dist;
            } while (dist > 1);
        }
        return shortestPathLength;
    }

    const dbg = performance.now();
    const accessible = new Map();

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
    starts.forEach(start => accessible.set(start, start.split(', ').map(x => +x)));

    accessible.forEach(([x, y]) => {
        computeSibling(x, y);
    });

    /* greedy algorithm to compute directions */
    const shortestPathLength = computeDirections();

    console.log(performance.now() - dbg);
    return {
        nbCellAccessible: accessible.size,
        nbShortestPath: shortestPathLength,
        cells: cells,
        accessible: Array.from(accessible.keys()),
    };
}
