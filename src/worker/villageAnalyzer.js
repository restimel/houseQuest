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
        return maze[x] && maze[x][y] || outsideMaze.get(getId(x, y)) || emptyCell;
    }
    function getInfo(x, y, cellsOnly) {
        if (cellsOnly) {
            return cells[x] && cells[x][y];
        }
        return cells[x] && cells[x][y] || outsideCells.get(getId(x, y)) || {
            dist: Infinity,
            orientation: '',
            parent: NaN,
            dirParent: '',
        };
    }
    function computeCell(x, y, dist, parent, dir) {
        const id = getId(x, y);
        if (accessible.has(id)) {
            return;
        }
        const cell = getInfo(x, y, true);
        if (!cell) {
            return;
        }
        cell.dist = dist;
        cell.parent = parent;
        cell.dirParent = dir;
        cell.orientation = dir;
        accessible.set(id, [x, y]);
    }
    function computeSibling(x, y) {
        const id = getId(x ,y);
        let cell = maze[x] && maze[x][y]; // not getCell
        let dist;
        if (!cell) {
            dist = 1;
            cell = {
                u: getCell(x, y - 1).d,
                d: getCell(x, y + 1).u,
                r: getCell(x + 1, y).l,
                l: getCell(x - 1, y).r,
            };
        } else {
            dist = getInfo(x, y).dist + 1;
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
    const incXhash = {
        'd': 0,
        'u': 0,
        'r': 1,
        'l': -1,
        '-d': 0,
        '-u': 0,
        '-r': -1,
        '-l': 1,
    };
    const incYhash = {
        'd': 1,
        'u': -1,
        'r': 0,
        'l': 0,
        '-d': -1,
        '-u': 1,
        '-r': 0,
        '-l': 0,
    };
    const convertPosition = {
        'u': 'u',
        'd': 'd',
        'r': 'r',
        'l': 'l',
        '-u': 'd',
        '-d': 'u',
        '-r': 'l',
        '-l': 'r',
    };
    const getDirection = {
        'u': 0,
        'd': 0,
        'l': 1,
        'r': 1,
        '-u': 0,
        '-d': 0,
        '-l': 1,
        '-r': 1,
    };
    function move(x, y, position, direction = 0) {
        const cell = getCell(x, y);
        const direction2 = (direction + 1) % 2;
        // check must be done in the reverse ordrer of the direction
        const check1 = position[direction2];
        const check2 = position[direction];
        let X, Y;
        let complexity = 0;
        if (cell[check1]) {
            const nX = x + incXhash[check1];
            const nY = y + incYhash[check1];
            [X, Y, complexity] = move(nX, nY, position, direction2);
            if (cell[check2]) {
                complexity++;
            }
        } else if (cell[check2]) {
            const nX = x + incXhash[check2];
            const nY = y + incYhash[check2];
            [X, Y, complexity] = move(nX, nY, position, direction);
        } else {
            X = x;
            Y = y;
        }

        return [X, Y, complexity];
    }

    function computeDirections() {
        let lastCell;
        let dir;
        let shortestPathLength = Infinity;

        endCells.forEach(([x, y]) => {
            let dist;

            if (getCell(x + 1, y).l) {
                dist =  getInfo(x + 1, y).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x + 1, y);
                    //dir is in opposite direction to match the "parent direction"
                    dir = 'r';
                }
            }

            if (getCell(x - 1, y).r) {
                dist = getInfo(x - 1, y).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x - 1, y);
                    dir = 'l';
                }
            }

            if (getCell(x, y + 1).u) {
                dist = getInfo(x, y + 1).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x, y + 1);
                    dir = 'd';
                }
            }

            if (getCell(x, y - 1).d) {
                dist = getInfo(x, y - 1).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = getId(x, y - 1);
                    dir = 'u';
                }
            }
        });

        if (isFinite(shortestPathLength)) {
            let dist = shortestPathLength;
            /* greedy algorithm */
            do {
                const [x, y] = lastCell.split(', ').map(x => +x);
                const cell = getInfo(x, y);
                shortestPath.add(lastCell);
                cell.orientation = '-' + dir;
                dir = cell.dirParent;
                lastCell = cell.parent;
                dist = cell.dist;
            } while (dist > 1);
            shortestPath.add(lastCell);
        }
        return shortestPathLength;
    }

    function computeOneMovement(x, y, pposition, isComplex, isOpposite) {
        const info = getInfo(x, y);
        let dir = convertPosition[info.orientation];
        let direction = getDirection[dir];
        const nposition = pposition.slice();
        const hard = (isComplex ? 1 : 0);

        if (!isOpposite) {
            nposition[direction] = dir;
        }

        if (isComplex || isOpposite) {
            direction = (direction + 1) % 2;
            nposition[direction] = convertPosition['-' + nposition[direction]];
            if (isComplex) {
                dir = nposition.join('');
            } else {
                dir = nposition[direction];
            }
        }

        let [X, Y, c] = move(x, y, nposition, direction);
        c = (c > 1 ? c - 1 : 0 );
        return [X, Y, c, hard, nposition, dir, getId(X, Y)];
    }

    function computeMovements(x, y) { //TODO all startCells
        //TODO  Astar();
        function buildState([x, y, complex, hard, position, mvt, id], cost) {
            return {
                id: id + '-' + position.join(','),
                cid: id,
                x: x,
                y: y,
                position: position,
                mvt: mvt,
                cost: cost,
                complex: complex,
                hard: hard,
            };
        }

        let complexity = 0;
        let hard = 0;
        const cell = getCell(x, y);
        let position = [
            cell.d ? 'u' : 'd',
            cell.l ? 'r' : 'l'
        ];
        const initValues = [buildState([x, y, 0, 0, position, '', getId(x, y)], 0)];
        const checkEnd = (value) => endCells.has(value.cid);
        const computeNext = (value) => {
            const {x, y, position} = value;
            const mvtNormal = computeOneMovement(x, y, position, false, false);
            const mvtOpposite = computeOneMovement(x, y, position, false, true);
            const mvtComplex = computeOneMovement(x, y, position, true, false);

            return [
                buildState(mvtNormal, 1),
                buildState(mvtOpposite, 1),
                buildState(mvtComplex, 10),
                // magic
            ];
        };
        var p1 = performance.now();
        const result = Astar({
            initValues,
            computeNext,
            checkEnd,
        })
        console.log('Aetoile', performance.now() -p1);
        return result;
    }

    function addOutside(kind, defaultDist) {
        kind.forEach(([x, y], id) => {
            const maze = Object.assign({}, emptyCell);
            const cell = {
                dist: defaultDist,
                orientation: '',
                parent: NaN,
                dirParent: '',
            };

            if (kind.has(getId(x + 1, y))) {
                maze.r = true;
            } else if (getCell(x + 1, y).l) {
                maze.r = true;
                cell.orientation = 'r';
            }

            if (kind.has(getId(x - 1, y))) {
                maze.l = true;
            } else if (getCell(x - 1, y).r) {
                maze.l = true;
                cell.orientation = 'l';
            }

            if (kind.has(getId(x, y + 1))) {
                maze.d = true;
            } else if (getCell(x, y + 1).u) {
                maze.d = true;
                cell.orientation = 'd';
            }

            if (kind.has(getId(x, y - 1))) {
                maze.u = true;
            } else if (getCell(x, y - 1).d) {
                maze.u = true;
                cell.orientation = 'u';
            }

            outsideMaze.set(id, maze);
            outsideCells.set(id, cell);
        });
    }

    const dbg = performance.now();
    const accessible = new Map();
    const startCells = new Map(starts.map(start => [start, start.split(/,\s*/).map(x => +x)]));
    const endCells = new Map(ends.map(end => [end, end.split(/,\s*/).map(x => +x)]));
    const outsideMaze = new Map();
    const outsideCells = new Map();

    addOutside(startCells, 0);
    addOutside(endCells, Infinity);

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
    startCells.forEach((start, id) => {
        accessible.set(id, start);
    });

    accessible.forEach(([x, y]) => {
        computeSibling(x, y);
    });

    /* compute directions */
    const shortestPath = new Set();
    const shortestPathLength = computeDirections();

    /* compute movements */
    let movements = [];
    let complexMovements = 0;
    let hardMovements = 0;
    if (isFinite(shortestPathLength)) {
        startCells.forEach(([x, y], id) => {
            if (shortestPath.has(id)) {
                [movements, complexMovements, hardMovements] = computeMovements(x, y);
            }
        });
    }

    console.log('analyze (in worker):', performance.now() - dbg);
    return {
        nbCellAccessible: accessible.size,
        nbShortestPath: shortestPathLength,
        shortestPath: Array.from(shortestPath),
        cells: cells,
        accessible: Array.from(accessible.keys()),
        movements: movements,
        complexMovements: complexMovements,
        hardMovements: hardMovements,
    };
}


function Astar({
    initValues,
    computeNext,
    checkEnd,
}) {
    const done = new Map();
    let result;
    let todo = initValues.map(v => ({
        v: v,
        id: v.id,
        d: 0,
        dh: v.cost,
        parent: null,
    }));

    function sortValues(v1, v2) {
        return v2.dh - v1.dh || v2.d - v1.d;
    }
    function hasValues(v) {
        const id = v.id;
        return done.has(id) || todo.some(i => i.id === id);
    }

    do {
        todo.sort(sortValues);
        const val = todo.pop();
        done.set(val.id, val);
        if (checkEnd(val.v)) {
            result = val;
            break;
        }
        const nextD = val.d + val.v.cost;
        const next = computeNext(val.v);
        next.forEach(n => {
            if (done.has(n.id)) {
                return;
            }
            let oN = todo.find(i => i.id === n.id);
            if (oN) {
                if (oN.dh > nextD + n.cost) {
                    // update
                    oN.v = n;
                    oN.d = nextD;
                    oN.dh = nextD + n.cost;
                    oN.parent = val.id;
                }
                return;
            }
            // add
            todo.push({
                v: n,
                id: n.id,
                d: nextD,
                dh: nextD + n.cost,
                parent: val.id,
            });
        });
    } while (todo.length);

    const list = [];
    const mvt = [];
    let complexity = 0;
    let hard = 0;
    while (result) {
        list.push(result.v);
        mvt.push(result.v.mvt);
        complexity += result.v.complex;
        hard += result.v.hard;
        result = done.get(result.parent);
    }
    return [mvt.reverse(), complexity, hard, list.reverse()]
}
