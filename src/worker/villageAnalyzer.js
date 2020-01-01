import { access } from "fs";

const isInTest = !!self.jasmine;
let inner_analyze = {};

const currentResult = {
    id: -1,
    error: false,
    data: null,
    progress: -1,
};

self.onmessage = ({ data: { id, action, data } }) => {
    const result = {
        id: id,
        error: false,
        data: null,
    };
    doAction(action, data, result, id);
    sendMessage(result);
};

const wallCell = {
    u: false,
    d: false,
    r: false,
    l: false,
    b: false,
    t: false,
};

const EMPTY_HOUSE = '_empty_';

let breakPause = function() {};

function sendMessage(message, extend = false) {
    const msg = extend ? Object.assign({}, currentResult, message) : message;
    self.postMessage(msg);
}

function doAction(action, data, result, id) {
    switch (action) {
        case 'analyze':
            result.data = analyze(data);
            break;
        case 'composition':
            Object.assign(currentResult, {
                id: id,
                error: false,
                data: {
                    progress: 0,
                },
            });

            result.data = {
                progress: 0,
            };
            compose(data, id);
            break;
        case 'stopComposition':
            currentResult.id = -1;
            break;
        case 'continueComposition':
            breakPause(data.pause);
            break;
        default:
            result.error = true;
            result.data = 'Action "' + action + '" is not implemented.';
    }
}

/* Helpers */

const incXhash = {
    'd': 0,
    'u': 0,
    'r': 1,
    'l': -1,
    '-d': 0,
    '-u': 0,
    '-r': -1,
    '-l': 1,
    'b': 0,
    't': 0,
    '-b': 0,
    '-t': 0,
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
    'b': 0,
    't': 0,
    '-b': 0,
    '-t': 0,
};
const incZhash = {
    'd': 0,
    'u': 0,
    'r': 0,
    'l': 0,
    '-d': 0,
    '-u': 0,
    '-r': 0,
    '-l': 0,
    'b': 1,
    't': -1,
    '-b': -1,
    '-t': 1,
};

const _revertDirection = {
    'u': 'd',
    'd': 'u',
    'l': 'r',
    'r': 'l',
    't': 'b',
    'b': 't',
    'u': 'd',
    '-d': 'd',
    '-l': 'l',
    '-r': 'r',
    '-t': 't',
    '-b': 'b',
};

const convertPosition = {
    'u': 'u',
    'd': 'd',
    'r': 'r',
    'l': 'l',
    'b': 'b',
    't': 't',
    '-u': 'd',
    '-d': 'u',
    '-r': 'l',
    '-l': 'r',
    '-b': 't',
    '-t': 'b',
};
const getNumDirection = {
    'u': 0,
    'd': 0,
    'l': 1,
    'r': 1,
    'b': 2,
    't': 2,
    '-u': 0,
    '-d': 0,
    '-l': 1,
    '-r': 1,
    '-b': 2,
    '-t': 2,
};

function revertDirection(direction) {
    return _revertDirection[direction];
}

/* Analyze */

const analyzeHlp = {
    getId: function getId(x, y, z) {
        return `${x}, ${y}, ${z}`;
    },
    isInside: function isInside(ctx, x, y, z) {
        return x >= 0 && x < ctx.mazeW && y >= 0 && y < ctx.mazeH && z >= 0 && z < ctx.mazeD;
    },
    getCell: function getCell({ maze, outsideMaze }, x, y, z, defaultCell = wallCell) {
        return maze[x] && maze[x][y] && maze[x][y][z] || outsideMaze.get(analyzeHlp.getId(x, y, z)) || defaultCell;
    },
    getInfo: function getInfo({ cells, outsideCells }, x, y, z, cellsOnly) {
        if (cellsOnly) {
            return cells[x] && cells[x][y] && cells[x][y][z];
        }
        return cells[x] && cells[x][y] && cells[x][y][z] || outsideCells.get(analyzeHlp.getId(x, y, z)) || {
            dist: Infinity,
            distEnd: Infinity,
            dirStart: '',
            dirEnd: '',
            parentStart: null,
            parentEnd: null,
        };
    },
    getDirection: function getDirectionCell(ctx, x, y, z, direction) {
        const oppDirection = revertDirection(direction);
        const nX = x + incXhash[direction];
        const nY = y + incYhash[direction];
        const nZ = z + incZhash[direction];

        const currentCell = analyzeHlp.getCell(ctx, x, y, z);
        const directionCell = analyzeHlp.getCell(ctx, nX, nY, nZ);

        return [nX, nY, nZ, currentCell[direction] && directionCell[oppDirection]];
    },
    addOutside: function addOutside(ctx, kind, defaultStartDist, defaultEndDist) {
        kind.forEach(([x, y, z], id) => {
            let mazeCell, cell;
            let isInside = false;

            if (analyzeHlp.isInside(ctx, x, y, z)) {
                // cell inside maze
                isInside = true;
                mazeCell = ctx.maze[x][y][z];
                cell = analyzeHlp.getInfo(ctx, x, y, z);
                cell.dist = defaultStartDist;
                cell.distEnd = defaultEndDist;
            } else {
                mazeCell = Object.assign({}, wallCell);
                cell = {
                    dist: defaultStartDist,
                    distEnd: defaultEndDist,
                    dirStart: '',
                    dirEnd: '',
                    parentStart: null,
                    parentEnd: null,
                };
            }
            let idNghb, passage;

            idNghb = analyzeHlp.getId(x + 1, y, z);
            passage =  analyzeHlp.getCell(ctx, x + 1, y, z).l;
            if (kind.has(idNghb) || passage) {
                mazeCell.r = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x + 1, y, z) || !cell.dirEnd)) {
                    cell.dirEnd = 'r';
                }
            }

            idNghb = analyzeHlp.getId(x - 1, y, z);
            passage =  analyzeHlp.getCell(ctx, x - 1, y, z).r;
            if (kind.has(idNghb) || passage) {
                mazeCell.l = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x - 1, y, z) || !cell.dirEnd)) {
                    cell.dirEnd = 'l';
                }
            }

            idNghb = analyzeHlp.getId(x, y + 1, z);
            passage =  analyzeHlp.getCell(ctx, x, y + 1, z).u;
            if (kind.has(idNghb) || passage) {
                mazeCell.d = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x, y + 1, z) || !cell.dirEnd)) {
                    cell.dirEnd = 'd';
                }
            }

            idNghb = analyzeHlp.getId(x, y - 1, z);
            passage =  analyzeHlp.getCell(ctx, x, y - 1, z).d;
            if (kind.has(idNghb) || passage) {
                mazeCell.u = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x, y - 1, z) || !cell.dirEnd)) {
                    cell.dirEnd = 'u';
                }
            }

            idNghb = analyzeHlp.getId(x, y, z + 1);
            passage =  analyzeHlp.getCell(ctx, x, y, z + 1).t;
            if (kind.has(idNghb) || passage) {
                mazeCell.b = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x, y, z + 1) || !cell.dirEnd)) {
                    cell.dirEnd = 'b';
                }
            }

            idNghb = analyzeHlp.getId(x, y, z - 1);
            passage =  analyzeHlp.getCell(ctx, x, y, z - 1).b;
            if (kind.has(idNghb) || passage) {
                mazeCell.t = true;
                if (!isInside && (analyzeHlp.isInside(ctx, x, y, z - 1) || !cell.dirEnd)) {
                    cell.dirEnd = 't';
                }
            }

            if (!isInside) {
                ctx.outsideMaze.set(id, mazeCell);
                ctx.outsideCells.set(id, cell);
            }
        });
    },
    computeCell: function computeCell(ctx, x, y, z, dist, distEnd, parent, dir) {
        const { accessible } = ctx;
        const id = analyzeHlp.getId(x, y, z);
        const cell = analyzeHlp.getInfo(ctx, x, y, z, true);
        if (!cell) {
            return false;
        }
        let hasChanged = false;
        if (cell.dist > dist) {
            cell.dist = dist;
            cell.parentStart = parent;
            cell.dirStart = dir;
            accessible.set(id, [x, y, z]);
            hasChanged = true;
        }
        if (cell.distEnd > distEnd) {
            cell.distEnd = distEnd;
            cell.parentEnd = parent;
            cell.dirEnd = dir;
            accessible.set(id, [x, y, z]);
            hasChanged = true;
        }
        return hasChanged;
    },
    computeSibling: function computeSibling(ctx, x, y, z = 0) {
        const { maze } = ctx;
        const id = analyzeHlp.getId(x, y, z);
        let cell = analyzeHlp.getCell(ctx, x, y, z, false);
        let dist, distEnd;
        let hasChanged = false;

        if (!cell) {
            dist = 1;
            distEnd = Infinity;
            cell = {
                u: analyzeHlp.getCell(ctx, x, y - 1, z).d,
                d: analyzeHlp.getCell(ctx, x, y + 1, z).u,
                r: analyzeHlp.getCell(ctx, x + 1, y, z).l,
                l: analyzeHlp.getCell(ctx, x - 1, y, z).r,
                b: analyzeHlp.getCell(ctx, x, y, z + 1).t,
                t: analyzeHlp.getCell(ctx, x, y, z - 1).b,
            };
        } else {
            const info = analyzeHlp.getInfo(ctx, x, y, z);
            dist = info.dist + 1;
            distEnd = info.distEnd + 1;
        }

        if (cell.u) {
            hasChanged = analyzeHlp.computeCell(ctx, x, y - 1, z, dist, distEnd, id, 'd') || hasChanged;
        }
        if (cell.d) {
            hasChanged = analyzeHlp.computeCell(ctx, x, y + 1, z, dist, distEnd, id, 'u') || hasChanged;
        }
        if (cell.r) {
            hasChanged = analyzeHlp.computeCell(ctx, x + 1, y, z, dist, distEnd, id, 'l') || hasChanged;
        }
        if (cell.l) {
            hasChanged = analyzeHlp.computeCell(ctx, x - 1, y, z, dist, distEnd, id, 'r') || hasChanged;
        }
        if (cell.b) {
            hasChanged = analyzeHlp.computeCell(ctx, x, y, z + 1, dist, distEnd, id, 't') || hasChanged;
        }
        if (cell.t) {
            hasChanged = analyzeHlp.computeCell(ctx, x, y, z - 1, dist, distEnd, id, 'b') || hasChanged;
        }

        return hasChanged;
    },
    computeDistance: function computeDistance(ctx) {
        /* check for all available cells */
        ctx.startCells.forEach((start, id) => {
            analyzeHlp.getInfo(ctx, ...start).dist = 0;
            ctx.accessible.set(id, start);
        });

        let hasChanged = true;
        while (hasChanged) {
            hasChanged = false;
            ctx.accessible.forEach(([x, y, z]) => {
                hasChanged = analyzeHlp.computeSibling(ctx, x, y, z) || hasChanged;
            });
        }
    },
    computeDirections: function computeDirections(ctx) {
        let lastCell;
        let dir;
        let shortestPathLength = Infinity;

        ctx.endCells.forEach(([x, y, z]) => {
            let dist;

            if (analyzeHlp.getCell(ctx, x + 1, y, z).l) {
                dist = analyzeHlp.getInfo(ctx, x + 1, y, z).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x + 1, y, z);
                    //dir is in opposite direction to match the "parentStart direction"
                    dir = 'r';
                }
            }

            if (analyzeHlp.getCell(ctx, x - 1, y, z).r) {
                dist = analyzeHlp.getInfo(ctx, x - 1, y, z).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x - 1, y, z);
                    dir = 'l';
                }
            }

            if (analyzeHlp.getCell(ctx, x, y + 1, z).u) {
                dist = analyzeHlp.getInfo(ctx, x, y + 1, z).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x, y + 1, z);
                    dir = 'd';
                }
            }

            if (analyzeHlp.getCell(ctx, x, y - 1, z).d) {
                dist = analyzeHlp.getInfo(ctx, x, y - 1, z).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x, y - 1, z);
                    dir = 'u';
                }
            }

            if (analyzeHlp.getCell(ctx, x, y, z - 1).b) {
                dist = analyzeHlp.getInfo(ctx, x, y, z - 1).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x, y, z - 1);
                    dir = 't';
                }
            }

            if (analyzeHlp.getCell(ctx, x, y, z + 1).t) {
                dist = analyzeHlp.getInfo(ctx, x, y, z + 1).dist;
                if (dist < shortestPathLength) {
                    shortestPathLength = dist;
                    lastCell = analyzeHlp.getId(x, y, z + 1);
                    dir = 'b';
                }
            }
        });
        shortestPathLength = shortestPathLength + 1;

        /* build shortestPath */
        if (isFinite(shortestPathLength)) {
            let dist = shortestPathLength;
            /* greedy algorithm */
            do {
                const [x, y, z] = lastCell.split(', ').map(x => +x);
                const cell = analyzeHlp.getInfo(ctx, x, y, z);
                ctx.shortestPath.add(lastCell);
                cell.dirEnd = revertDirection(dir);
                dir = cell.dirStart;
                lastCell = cell.parentStart;
                dist = cell.dist;
            } while (dist > 1);
            ctx.shortestPath.add(lastCell);
        }
        return shortestPathLength;
    },
    /**
     * position: [u/d, l/r, t/b]
     * direction: 0 (move vertically), 1 (move horizontally)
     */
    move: function move(ctx, x, y, z, position, direction = 0) {
        const cell = analyzeHlp.getCell(ctx, x, y, z);
        direction = direction % 2;
        const direction2 = (direction + 1) % 2;
        const directionD = 2;
        // XXX: check must be done first deply then in the opposite direction
        const dir1 = position[directionD];
        const dir2 = position[direction2];
        const dir3 = position[direction];
        const check1 = analyzeHlp.getDirection(ctx, x, y, z, dir1);
        const check2 = analyzeHlp.getDirection(ctx, x, y, z, dir2);
        const check3 = analyzeHlp.getDirection(ctx, x, y, z, dir3);

        let X, Y, Z;
        let complexity = 0;
        if (check1[3]) {
            const [nX, nY, nZ] = check1;
            if (x === nX && y === nY && z === nZ) {
                return [x, y, z, complexity];
            }

            // XXX: keep previous direction while moving deeply
            [X, Y, Z, complexity] = move(ctx, nX, nY, nZ, position, direction);
            if (check2[3] || check3[3]) {
                complexity++;
            }
            return [X, Y, Z, complexity];
        }

        if (check2[3]) {
            const [nX, nY, nZ] = check2;
            if (x === nX && y === nY && z === nZ) {
                return [x, y, z, complexity];
            }

            [X, Y, Z, complexity] = move(ctx, nX, nY, nZ, position, direction2);
            if (check3[3]) {
                complexity++;
            }
            return [X, Y, Z, complexity];
        }

        if (check3[3]) {
            const [nX, nY, nZ] = check3;
            if (x === nX && y === nY && z === nZ) {
                return [x, y, z, complexity];
            }

            [X, Y, Z, complexity] = move(ctx, nX, nY, nZ, position, direction);

            return [X, Y, Z, complexity];
        }

        return [x, y, z, complexity];
    },
    /** compute the movement from the position
     * pposition: [u/d, l/r, t/b]
     * normal: try the way to end
     * opposite: try the opposite movement (not the normal way)
     * reverse: try to move deeply
     */
    computeOneMovement: function computeOneMovement(ctx, x, y, z, pposition, {normal, opposite, reverse}) {
        if (!opposite && !reverse) {
            normal = true;
        }
        const info = analyzeHlp.getInfo(ctx, x, y, z);
        // if (!info.dirEnd) {
        //     console.log(x, y, z, info, pposition);
        // }
        const nposition = pposition.slice();
        const finalDir = new Array(3);
        const hard = (+normal + +opposite + +reverse) - 1;

        const normalDir = convertPosition[info.dirEnd] || 'l';
        let numDirection = getNumDirection[normalDir];

        // follow the natural way
        if (normal) {
            const dir = revertDirection(nposition[numDirection]);
            nposition[numDirection] = dir;
            finalDir[numDirection] = dir;
        }

        if (opposite) {
            numDirection = (numDirection + 1) % 2;
            const dir = revertDirection(nposition[numDirection]);
            nposition[numDirection] = dir;
            finalDir[numDirection] = dir;
        }

        if (reverse) {
            numDirection = 2;
            const dir = revertDirection(nposition[numDirection]);
            nposition[numDirection] = dir;
            finalDir[numDirection] = dir;
        }

        let [X, Y, Z, c] = analyzeHlp.move(ctx, x, y, z, nposition, numDirection);
        c = (c > 1 ? c - 1 : 0);
        return [X, Y, Z, c, hard, nposition, finalDir.join(''), analyzeHlp.getId(X, Y, Z)];
    },
    computeMovements: function computeMovements(ctx, x, y, z) {
        const { getCell, getId, computeOneMovement } = analyzeHlp;
        function buildState([x, y, z, complex, hard, position, mvt, id], cost) {
            return {
                id: id + '-' + position.join(','),
                cid: id,
                x: x,
                y: y,
                z: z,
                position: position,
                mvt: mvt,
                cost: cost,
                complex: complex,
                hard: hard,
            };
        }

        const cell = getCell(ctx, x, y, z);
        let position = [
            cell.d && y > 0 ? 'u' : 'd',
            cell.l && x > 0 ? 'r' : 'l',
            cell.b && z < ctx.mazeD - 1 ? 't' : 'b',
        ];
        const initValues = [buildState([x, y, z, 0, 0, position, '', getId(x, y, z)], 0)];
        const checkEnd = (value) => ctx.endCells.has(value.cid);
        const computeNext = (value) => {
            const { x, y, z, position } = value;
            const mvtNormal = computeOneMovement(ctx, x, y, z, position, { normal: true, opposite: false, reverse: false });
            const mvtOpposite = computeOneMovement(ctx, x, y, z, position, { normal: false, opposite: true, reverse: false });
            const mvtComplex = computeOneMovement(ctx, x, y, z, position, { normal: true, opposite: true, reverse: false });
            const mvtReverse = computeOneMovement(ctx, x, y, z, position, { normal: false, opposite: false, reverse: true });
            const mvtCplxReverse1 = computeOneMovement(ctx, x, y, z, position, { normal: true, opposite: false, reverse: true });
            const mvtCplxReverse2 = computeOneMovement(ctx, x, y, z, position, { normal: false, opposite: true, reverse: true });
            const mvtAll = computeOneMovement(ctx, x, y, z, position, { normal: true, opposite: true, reverse: true });

            return [
                buildState(mvtNormal, 1),
                buildState(mvtOpposite, 1),
                buildState(mvtComplex, 10),
                buildState(mvtReverse, 3),
                buildState(mvtCplxReverse1, 15),
                buildState(mvtCplxReverse2, 15),
                buildState(mvtAll, 25),
                // magic
            ];
        };
        const result = Astar({
            initValues,
            computeNext,
            checkEnd,
        })
        return result;
    },
};

function analyze({maze, starts, ends}) {
    const z = 0;
    const { computeDirections, computeMovements } = analyzeHlp;

    const mazeW = maze.length;
    const mazeH = mazeW && maze[0].length;
    const mazeD = mazeH && maze[0][0].length;

    const startCells = new Map(starts.map(start => [start, start.split(/,\s*/).map(x => +x)]));
    const endCells = new Map(ends.map(end => [end, end.split(/,\s*/).map(x => +x)]));

    /* prepare a state for all cells to store distance and best direction */
    const cells = new Array(mazeW);
    for (let x = 0; x < mazeW; x++) {
        cells[x] = new Array(mazeH);
        for (let y = 0; y < mazeH; y++) {
            cells[x][y] = new Array(mazeD);
            for (let z = 0; z < mazeD; z++) {
                // cells initialization
                cells[x][y][z] = {
                    dist: Infinity,
                    distEnd: Infinity,
                    dirEnd: '',
                    dirStart: '',
                    parentStart: null,
                    parentEnd: null,
                };
            }
        }
    }

    const ctx = {
        maze,
        cells,
        mazeW,
        mazeH,
        mazeD,
        outsideMaze: new Map(),
        outsideCells: new Map(),
        accessible: new Map(),
        startCells,
        endCells,
        shortestPath: new Set(),
    };

    /* Add start and end cells */
    analyzeHlp.addOutside(ctx, startCells, 0, Infinity);
    analyzeHlp.addOutside(ctx, endCells, Infinity, 0);

    /* compute distance and set available cells */
    analyzeHlp.computeDistance(ctx);

    /* compute directions */
    const shortestPathLength = computeDirections(ctx);

    /* compute movements */
    let movements = [];
    let complexMovements = 0;
    let hardMovements = 0;
    if (isFinite(shortestPathLength)) {
        startCells.forEach(([x, y, z], id) => {
            if (ctx.shortestPath.has(id)) {
                [movements, complexMovements, hardMovements] = analyzeHlp.computeMovements(ctx, x, y, z);
            }
        });
    }

    return {
        nbCellAccessible: ctx.accessible.size,
        nbShortestPath: shortestPathLength,
        shortestPath: Array.from(ctx.shortestPath),
        cells: cells,
        accessible: Array.from(ctx.accessible.keys()),
        movements: movements,
        complexMovements: complexMovements,
        hardMovements: hardMovements,
        difficulty: 0,
        difficultyPercent: 0,
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
        v: v, // node
        id: v.id, // identifier
        d: 0, // real distance
        dh: v.cost, // heuristic distance
        parent: null, // id of parent node
    }));

    function sortValues(v1, v2) {
        return v2.dh - v1.dh || v2.d - v1.d;
    }
    // function hasValues(v) {
    //     const id = v.id;
    //     return done.has(id) || todo.some(i => i.id === id);
    // }

    // let dbg = 0;
    do {
        // dbg++;
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

/**
 * Compose
 */

const bashTime = 1500;
const mainTimeLimit = 5000;
function compose(data, id) {
    // preparation
    let mainTime = performance.now();
    const {
        mazes, mazeWidth, mazeHeight, mazeDepth = 1,
        mazeWidthHouse, mazeHeightHouse, houseWidth, houseHeight,
        starts, ends,
        useOnce,
        offset, filter,
        nbPossibilities: nbToTest,
    } = data;
    const nbMaxCell = mazeWidth * mazeHeight;
    let startOffset = offset;
    const cellExt = starts.concat(ends);
    const difficultyMax = getDifficultyMax(filter.weight);

    const housesStore = new Map();
    const houseUsed = new Set();

    let nbTested = startOffset;
    let _offsetIdx = startOffset;

    const possibilities = data.infos.map((info, index) => {
        let houses, orientations;

        if (info.houses.length) {
            houses = info.houses;
        } else {
            houses = data.defaultInfo.houses;
        }

        if (info.orientations.length) {
            orientations = info.orientations;
        } else {
            orientations = data.defaultInfo.orientations;
        }

        return {
            houses, orientations,
            idxHouse: 0,
            idxOrientation: 0,
            x: Math.floor(index / mazeWidthHouse),
            y: index % mazeWidthHouse,
            shortcutCost: orientations.length,
            orientationShortCut: 1,
        };
    });
    possibilities.reduceRight((previous, current, idx) => {
        if (previous) {
            const previousCost = previous.shortcutCost * previous.houses.length;
            current.orientationShortCut = previousCost;
            current.shortcutCost *= previousCost;
        }
        // set indexes to the correct values (when a starting offset is given)
        if (_offsetIdx) {
            const costOrientation = current.orientations.length;
            const idxOrientation = _offsetIdx % costOrientation;
            current.idxOrientation = idxOrientation;
            _offsetIdx = (_offsetIdx - idxOrientation) / costOrientation;

            const costHouse = current.houses.length;
            const idxHouse = _offsetIdx % costHouse;
            current.idxHouse = idxHouse;
            _offsetIdx = (_offsetIdx - idxHouse) / costHouse;
        }
        return current;
    }, null);

    if (useOnce) {
        for (let idx = 0; idx < possibilities.length; idx++) {
            const possibility = possibilities[idx];

            if (possibility.idxHouse >= possibility.houses.length) {
                // previous possibility need to jump to next house
                if (idx === 0) {
                    // There is no solution left
                    // nbTested = nbToTest; // because last increments where false
                    return finish();
                }
                possibility.idxHouse = 0;
                idx--;
                const previousPossibility = possibilities[idx];
                const previousName = previousPossibility.houses[previousPossibility.idxHouse];
                houseUsed.delete(previousName);
                nbTested += previousPossibility.orientations.length - 1; // XXX: it is not shortcut because the cost of next house is already computed
                previousPossibility.idxHouse++;
                idx--;
                const idxOrientation = previousPossibility.idxOrientation;
                if (idxOrientation) {
                    nbTested -= idxOrientation;
                    previousPossibility.idxOrientation = 0;
                }
                continue;
            }

            const houseName = possibility.houses[possibility.idxHouse];
            if (houseUsed.has(houseName)) {
                // jump to next house
                nbTested += possibility.shortcutCost;
                possibility.idxHouse++;
                idx--; // recompute this possibility
                const idxOrientation = possibility.idxOrientation;
                if (idxOrientation) {
                    nbTested -= idxOrientation;
                    possibility.idxOrientation = 0;
                }
                continue;
            }
            if (houseName !== EMPTY_HOUSE) {
                houseUsed.add(houseName);
            }
        }
        startOffset = nbTested;
    }

    // prepare validation functions
    let nextStartIdx = 0;
    let nextFinishIdx = 0;

    const validationStart = starts.map( cell => {
        const [f, possibilityIdx] = getCellChecker(cell);
        nextStartIdx = Math.max(nextStartIdx, possibilityIdx);

        return f;
    });
    const validationFinish = ends.map(cell => {
        const [f, possibilityIdx] = getCellChecker(cell);
        nextFinishIdx = Math.max(nextFinishIdx, possibilityIdx);

        return f;
    });
    function getCellChecker(cell) {
        const [x, y, z] = cell.split(', ');
        let orientation = '';
        let X = +x;
        let Y = +y;
        let Z = +z;

        if (X < 0) {
            X = 0;
            orientation = 'l';
        } else
        if (X >= mazeWidth) {
            X = mazeWidth - 1;
            orientation = 'r';
        }

        if (Y < 0) {
            Y = 0;
            orientation = 'u';
        } else
        if (Y >= mazeHeight) {
            Y = mazeHeight - 1;
            orientation = 'd';
        }

        if (Z < 0) {
            Z = 0;
            orientation = 't';
        } else
        if (Z >= mazeDepth) {
            Z = mazeDepth - 1;
            orientation = 'b';
        }

        const possibilityIdx = Math.floor(((X * mazeHeight) + Y) / (houseWidth * houseHeight));
        const cellX = X % houseWidth;
        const cellY = Y % houseHeight;

        return [buildChecker(cellX, cellY, possibilityIdx, orientation), possibilityIdx];
    }
    function buildChecker(cellX, cellY, possibilityIdx, orientation) {
        return () => readCell(cellX, cellY, possibilityIdx)[orientation];
    }

    // start looping
    setTimeout(runBash, 1, id);

    // declare functions
    function finish() {
        sendMessage({finished: true, id: id, data: { progress: nbTested / nbToTest, offset: nbTested } }, true);
    }

    function sendResult(data) {
        sendMessage({
            id: id,
            data: Object.assign({
                progress: nbTested / nbToTest,
                offset: nbTested,
            }, data)
        }, true);
    }

    function readCell(houseX, houseY, possibilityIdx) {
        const possibility = possibilities[possibilityIdx];
        const house = possibility.houses[possibility.idxHouse];
        const orientation = possibility.orientations[possibility.idxOrientation];
        const maze = getHouse(house, orientation).maze;

        const row = maze[houseX];
        const cell = row && row[houseY];

        return cell || {};
    }

    function runBash(id) {
        if (id !== currentResult.id) {
            return finish();
        }
        const time = performance.now();
        let responses = [];
        const timeLimit = startOffset === nbTested ? bashTime / 2 : bashTime;

        do {
            let maze;

            if (startOffset !== nbTested && !nextAction()) {
                if (responses.length) {
                    sendResult({
                        results: responses
                    });
                    responses = null;
                }
                return finish();
            }

            if (++nbTested > nbToTest) {
                // If all works correctly it should never happen
                if (responses.length) {
                    sendResult({
                        results: responses
                    });
                    responses = [];
                }
                // protection over infinite loop
                if (nbTested > 2 * nbToTest) {
                    return finish();
                } else {
                    console.warn('Limit reach', nbTested, nbToTest);
                }
            }

            if (!(maze = buildMaze())) {
                continue;
            }

            const result = analyze({ maze, starts, ends });
            if (result.nbShortestPath > nbMaxCell) {
                continue;
            }

            result.difficulty = getDifficulty(filter.weight, {
                result,
                nbMaxCells: nbMaxCell,
                sizeX: mazeWidth,
            });
            result.difficultyPercent = getDifficultyEstimation(result.difficulty, difficultyMax);
            if (result.difficultyPercent < filter.difficulty[0] || result.difficultyPercent > filter.difficulty[1]) {
                continue;
            }

            responses.push({
                houses: possibilities.map((possibility) => possibility.houses[possibility.idxHouse] + '§' + possibility.orientations[possibility.idxOrientation]),
                result: result,
            });
        } while (performance.now() - time < timeLimit);

        const isInTime = performance.now() - mainTime < mainTimeLimit;

        sendResult({
            results: responses,
            isInPause: !isInTime,
        });

        responses = [];
        if (isInTime) {
            setTimeout(runBash, 1, id);
        } else {
            breakPause = function() {
                mainTime = performance.now();
                runBash(id);
            };
        }
    }

    function nextAction(index = possibilities.length - 1) {
        let current = possibilities[index];
        let validationOk = false;

        while (!validationOk) {
            validationOk = true;

            const houseName = current.houses[current.idxHouse];
            const nbOrientations = current.orientations.length - 1;

            // upgrade to next orientations
            if (houseName !== EMPTY_HOUSE && current.idxOrientation < nbOrientations) {
                current.idxOrientation++;
            } else {
                nbTested += current.orientationShortCut * (nbOrientations - current.idxOrientation);
                current.idxOrientation = 0;

                let ok = false;
                while (!ok) {
                    ok = true;

                    // upgrade to next House
                    if (current.idxHouse < current.houses.length - 1) {
                        current.idxHouse++;
                    } else {
                        current.idxHouse = 0;
                        // upgrade next possibility
                        if (index > 0) {
                            if (!nextAction(index - 1)) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }

                    if (useOnce) {
                        const houseUsed = new Set();
                        for (let idx = 0; idx <= index; idx++) {
                            const possibility = possibilities[idx];
                            const houseName = possibility.houses[possibility.idxHouse];
                            if (houseName !== EMPTY_HOUSE) {
                                if (houseUsed.has(houseName)) {
                                    ok = false;
                                    break;
                                }
                                houseUsed.add(houseName);
                            }
                        }

                        if (!ok) {
                            nbTested += current.shortcutCost;
                        }
                    }
                }
            }

            // check cells
            if (index === nextStartIdx) {
                validationOk = validationStart.some(validation => validation());
            }
            if (validationOk && index === nextFinishIdx) {
                validationOk = validationFinish.some(validation => validation());
            }

            if (!validationOk) {
                nbTested += current.orientationShortCut;
            }
        }

        return true;
    }

    function buildMaze() {
        const maze = _initMaze(mazeWidth, mazeHeight);

        function getCell(x, y, maze) {
            const row = maze[x];
            let cell = row && row[y];
            if (!cell) {
                const id = [x, y].join(', ');
                const val = !!cellExt.find((c) => c === id);
                return {u: val, d: val, l: val, r: val, b: val, t: val};
            }
            return cell;
        }

        function copyCell(house, x, y) {
            const {u, d, l, r, b, t} = house[x][y];
            return {u, d, l, r, b, t};
        }

        // copy houses to maze
        for (let info of possibilities) {
            const houseName = info.houses[info.idxHouse];
            const orientation = info.orientations[info.idxOrientation];
            const offsetX = info.x * houseWidth;
            const offsetY = info.y * houseHeight;
            const house = getHouse(houseName, orientation);
            const houseMaze = house.maze;

            // apply the copy
            for (let x = 0; x < houseWidth; x++) {
                for (let y = 0; y < houseHeight; y++) {
                    maze[x + offsetX][y + offsetY] = copyCell(houseMaze, x, y);
                }
            }
        }

        // update border cells
        const mazeX = maze.length;
        const mazeY = maze[0].length;
        const z = 0;
        for (let x = 0; x < mazeX; x++) {
            for (let y = 0; y < mazeY; y++) {
                const cell = maze[x][y];
                if (cell.u && !getCell(x, y - 1, z, maze).d) {
                    cell.u = false;
                }
                if (cell.d && !getCell(x, y + 1, z, maze).u) {
                    cell.d = false;
                }
                if (cell.r && !getCell(x + 1, y, z, maze).l) {
                    cell.r = false;
                }
                if (cell.l && !getCell(x - 1, y, z, maze).r) {
                    cell.l = false;
                }
                if (!cell.b && getCell(x, y, z + 1, maze).t) {
                    cell.b = false;
                }
                if (!cell.t && getCell(x, y, z - 1, maze).b) {
                    cell.t = false;
                }
            }
        }

        return maze;
    }

    function getHouse(name, orientation) {
        const key = `${name}§${orientation}`;

        if (!housesStore.has(key)) {
            const house = mazes[name];
            if (orientation === 'UP') {
                housesStore.set(key, house);
            } else {
                housesStore.set(key, {maze: rotateHouse(house, orientation)});
            }
        }

        return housesStore.get(key);
    }
}

/** Copy of _initMaze in models/village.js */
function _initMaze(xLength, yLength) {
    const maze = new Array(xLength);
    for (let x = 0; x < xLength; x++) {
        const column = new Array(yLength)
        maze[x] = column;
        for (let y = 0; y < yLength; y++) {
            column[y] = {
                u: true,
                d: true,
                l: true,
                r: true,
                b: false,
                t: false,
            };
        }
    }

    return maze;
}

function rotateHouse(house, orientation) {
    const maze = house.maze;
    const sizeX = maze.length;
    const sizeY = maze[0].length;
    const newMaze = new Array(sizeX);

    function getCell(x, y, z) {
        let X, Y, Z, cell;
        Z = z;
        switch(orientation) {
            case 'DOWN':
                X = sizeX - x - 1;
                Y = sizeY - y - 1;
                cell = maze[X][Y] || wallCell;
                return {
                    u: cell.d,
                    d: cell.u,
                    r: cell.l,
                    l: cell.r,
                    b: cell.b,
                    t: cell.t,
                };
            case 'LEFT':
                X = sizeX - y - 1;
                Y = x;
                cell = maze[X][Y] || wallCell;
                return {
                    u: cell.r,
                    d: cell.l,
                    r: cell.d,
                    l: cell.u,
                    b: cell.b,
                    t: cell.t,
                };
            case 'RIGHT':
                X = y;
                Y = sizeY - x - 1;
                cell = maze[X][Y] || wallCell;
                return {
                    u: cell.l,
                    d: cell.r,
                    r: cell.u,
                    l: cell.d,
                    b: cell.b,
                    t: cell.t,
                };
            case 'UP':
                return maze[x][y];
        }
    }

    for (let x = 0; x < sizeX; x++) {
        const newMazeX = newMaze[x] = new Array(sizeY);
        for (let y = 0; y < sizeY; y++) {
            newMazeX[y] = getCell(x, y, 0);
        }
    }

    return newMaze;
}


function getDifficultyMax(weight) {
    const nbCell = 1 * weight.nbCellAccessible;
    const nbShtPath = 1 * weight.nbShortPath;
    const nbMovements = 1 * weight.nbMovements;
    const nbComplexMove = 1 * weight.nbComplexMove;
    const nbHardMove = 1 * weight.nbHardMove;
    return 0.01 + nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
}
function getDifficulty(weight, {result, nbMaxCells, sizeX}) {
    const nbCell = (result.nbCellAccessible / nbMaxCells) * weight.nbCellAccessible;
    const nbShtPath = (result.nbShortestPath / nbMaxCells) * weight.nbShortPath;
    const nbMovements = (result.movements.length / (nbMaxCells - sizeX)) * weight.nbMovements;
    const nbComplexMove = asymptotic(result.complexMovements, sizeX, 6) * weight.nbComplexMove;
    const nbHardMove = asymptotic(result.hardMovements, 9, 3) * weight.nbHardMove;
    return 0.01 + nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
}
function getDifficultyEstimation(difficulty, difficultyMax) {
    const value = asymptotic(difficulty, difficultyMax, 5);
    return Math.round(value * 10000) / 100;
}
function asymptotic(x, Tmax = 100, Quickness = 1) {
    return (1 - Tmax / (Quickness * x + Tmax));
}

/* for test purpose */
if (isInTest) {
    const forTest = {
        analyze,
        analyzeHlp,
        Astar,
        compose,
        inner_compose: {},
        _initMaze,
    };

    self.villageAnalyzer = forTest;
}