import { access } from "fs";

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

const emptyCell = {
    u: false,
    d: false,
    r: false,
    l: false,
};

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
        const result = Astar({
            initValues,
            computeNext,
            checkEnd,
        })
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

const bashTime = 1000;
async function compose(data, id) {
    // preparation
    const nbToTest = data.nbPossibilities;
    const {
        mazes, mazeWidth, mazeHeight,
        mazeWidthHouse, mazeHeightHouse, houseWidth, houseHeight,
        starts, ends,
        useOnce,
        offset: startOffset,
    } = data;

    const houses = new Map();
    const houseUsed = new Set();

    let nbTested = startOffset;
    // TODO use starting states depending of nbTested
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
        };
    });
    possibilities.reduceRight((previous, current) => {
        if (previous) {
            current.shortcutCost *= previous.shortcutCost * previous.houses.length;
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
                    return finish();
                }
                possibility.idxHouse = 0;
                idx--;
                const nextPossibility = possibilities[idx];
                houseUsed.delete(nextPossibility.name);
                nbTested += nextPossibility.shortcutCost;
                nextPossibility.idxHouse++;
                idx--;
                continue;
            }

            const houseName = possibility.houses[possibility.idxHouse];

            if (houseUsed.has(houseName)) {
                // jump to next house
                nbTested += possibility.orientations.length;
                possibility.idxHouse++;
                idx--; // recompute this possibility
                continue;
            }
            houseUsed.add(houseName);
        }
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

    function runBash(id) {
        let hasSend = false;
        if (id !== currentResult.id) {
            return finish();
        }
        const time = Date.now();

        do {
            let maze;

            if (startOffset !== nbTested && !nextAction()) {
                return finish();
            } else
            if (++nbTested >= nbToTest) {
                return finish();
            } else
            if (!(maze = buildMaze())) {
                continue;
            }
            const result = analyze({ maze, starts, ends });
            if (result.nbShortestPath < 1024) {
                sendResult({
                    maze: maze,
                    houses: possibilities.map((possibility) => possibility.houses[possibility.idxHouse] + '§' + possibility.orientations[possibility.idxOrientation]),
                    result: result,
                });
                hasSend = true;
            }
        } while (Date.now() - time < bashTime);

        if (!hasSend) {
            sendResult();
        }
        setTimeout(runBash, 1, id);
    }

    function nextAction(index = possibilities.length - 1) {
        let current = possibilities[index];
        // upgrade to next orientations
        if (current.idxOrientation < current.orientations.length - 1) {
            current.idxOrientation++;
        } else {
            current.idxOrientation = 0;

            let ok = false;
            while (!ok) {
                ok = true;
                // upgrade to next House
                if (current.idxHouse < current.houses.length - 1) {
                    current.idxHouse++;
                } else {
                    current.idxHouse = 0;
                    --index;
                    // upgrade next possibility
                    if (index >= 0) {
                        if (!nextAction(index)) {
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
                        houseUsed.add(possibility.houses[possibility.idxHouse]);
                    }
                    if (houseUsed.size <= index) {
                        nbTested += current.shortcutCost;
                        ok = false;
                    }
                }
            };
        }

        return true;
    }

    function buildMaze() {
        const maze = _initMaze(mazeWidth, mazeHeight);
        const houseUsed = new Set();
        const ext = starts.concat(ends);

        function getCell(x, y) {
            const row = maze[x];
            let cell = row && row[y];
            if (!cell) {
                const id = [x, y].join(', ');
                const val = !!ext.find((c) => c === id);
                return {u: val, d: val, l: val, r: val};
            }
            return cell;
        }

        // copy houses to maze
        for (let info of possibilities) {
            const houseName = info.houses[info.idxHouse];
            const orientation = info.orientations[info.idxOrientation];
            const offsetX = info.x * houseWidth;
            const offsetY = info.y * houseHeight;
            if (useOnce) {
                if (houseUsed.has(houseName)) {
                    return false;
                }
                houseUsed.add(houseName);
            }
            const house = getHouse(houseName, orientation);
            const houseMaze = house.maze;

            // apply the copy
            for (let x = 0; x < houseWidth; x++) {
                for (let y = 0; y < houseHeight; y++) {
                    maze[x + offsetX][y + offsetY] = houseMaze[x][y];
                }
            }
        }

        // update border cells
        const mazeX = maze.length;
        const mazeY = maze[0].length;
        for (let x = 0; x < mazeX; x++) {
            for (let y = 0; y < mazeY; y++) {
                const cell = maze[x][y];
                if (cell.u && !getCell(x, y - 1).d) {
                    cell.u = false;
                }
                if (cell.d && !getCell(x, y + 1).u) {
                    cell.d = false;
                }
                if (cell.r && !getCell(x + 1, y).l) {
                    cell.r = false;
                }
                if (cell.l && !getCell(x - 1, y).r) {
                    cell.l = false;
                }
            }
        }

        // check maze

        return maze;
    }

    function getHouse(name, orientation) {
        const key = `${name}§${orientation}`;

        if (!houses.has(key)) {
            const house = mazes[name];
            if (orientation === 'UP') {
                houses.set(key, house);
            } else {
                houses.set(key, {maze: rotateHouse(house, orientation)});
            }
        }

        return houses.get(key);
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

    function getCell(x, y) {
        let X, Y, cell;
        switch(orientation) {
            case 'DOWN':
                X = sizeX - x - 1;
                Y = sizeY - y - 1;
                cell = maze[X][Y] || noCell;
                return {
                    u: cell.d,
                    d: cell.u,
                    r: cell.l,
                    l: cell.r,
                };
            case 'LEFT':
                X = sizeX - y - 1;
                Y = x;
                cell = maze[X][Y] || noCell;
                return {
                    u: cell.r,
                    d: cell.l,
                    r: cell.d,
                    l: cell.u,
                };
            case 'RIGHT':
                X = y;
                Y = sizeY - x - 1;
                cell = maze[X][Y] || noCell;
                return {
                    u: cell.l,
                    d: cell.r,
                    r: cell.u,
                    l: cell.d,
                };
            case 'UP':
                return maze[x][y];
        }
    }

    for (let x = 0; x < sizeX; x++) {
        const newMazeX = newMaze[x] = new Array(sizeY);
        for (let y = 0; y < sizeY; y++) {
            newMazeX[y] = getCell(x, y);
        }
    }

    return newMaze;
}
const noCell = {
    u: false,
    d: false,
    l: false,
    r: false,
};