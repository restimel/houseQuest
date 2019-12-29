// import Vue from 'vue'
import '@/worker/villageAnalyzer.js'
const Analyzer = self.villageAnalyzer;

// false → wall | true → passage
const emptyCell = {
    u: true,
    d: true,
    l: true,
    r: true,
    b: false,
    t: false,
};
const wallCell = {
    u: false,
    d: false,
    r: false,
    l: false,
    b: false,
    t: false,
};

/**______
 * |_ |↓|
 * |_ | |
 * |____|
 */
const mazeLvl01 = Analyzer._initMaze(3, 3);
mazeLvl01[0][0].d = false;
mazeLvl01[1][0].r = false;
mazeLvl01[2][0].l = false;
mazeLvl01[2][0].b = true;
mazeLvl01[0][1].u = false;
mazeLvl01[0][1].d = false;
mazeLvl01[1][1].r = false;
mazeLvl01[2][1].l = false;
mazeLvl01[0][2].u = false;

/**_______
 * |  _ _↑|
 * |   |↓ |
 * |↓|____|
 */
const mazeLvl02 = Analyzer._initMaze(3, 3);
mazeLvl02[1][0].d = false;
mazeLvl02[2][0].t = true;
mazeLvl02[2][0].d = false;
mazeLvl02[1][1].u = false;
mazeLvl02[1][1].r = false;
mazeLvl02[2][1].l = false;
mazeLvl02[2][1].u = false;
mazeLvl02[2][1].b = true;
mazeLvl02[0][2].r = false;
mazeLvl02[0][2].b = true;
mazeLvl02[1][2].l = false;

/**_______
 * |_ _ _|
 * |↓  |↑|
 * |↑|___|
 */
const mazeLvl03 = Analyzer._initMaze(3, 3);
mazeLvl03[0][0].d = false;
mazeLvl03[1][0].d = false;
mazeLvl03[2][0].d = false;
mazeLvl03[0][1].u = false;
mazeLvl03[0][1].b = true;
mazeLvl03[1][1].r = false;
mazeLvl03[1][1].u = false;
mazeLvl03[2][1].l = false;
mazeLvl03[2][1].u = false;
mazeLvl03[2][1].t = true;
mazeLvl03[0][2].r = false;
mazeLvl03[0][2].t = true;
mazeLvl03[1][2].l = false;

/**_______
 * |  |   |
 * |↑↓  | |
 * |__|_|_|
 */
const mazeLvl04 = Analyzer._initMaze(3, 3);
mazeLvl04[0][0].r = false;
mazeLvl04[1][0].l = false;
mazeLvl04[0][1].b = true;
mazeLvl04[0][1].t = true;
mazeLvl04[1][1].r = false;
mazeLvl04[2][1].l = false;
mazeLvl04[0][2].r = false;
mazeLvl04[1][2].l = false;
mazeLvl04[1][2].r = false;
mazeLvl04[2][2].l = false;

/**______
 * | |   |
 * |↑    |
 * |_|___|
 */
const mazeLvl05 = Analyzer._initMaze(3, 3);
mazeLvl05[0][0].r = false;
mazeLvl05[1][0].l = false;
mazeLvl05[0][1].t = true;
mazeLvl05[0][2].r = false;
mazeLvl05[1][2].l = false;


const maze = mazeLvl01.map((row, x) => row.map((cell, y) => [
    cell,
    mazeLvl02[x][y],
    mazeLvl03[x][y],
    mazeLvl04[x][y],
    mazeLvl05[x][y],
]));
const mazeD = 5;

function __buildCells() {
    const cells = maze.map((row, x) => row.map((col, y) => col.map((cell, z) => {
        return {
            dist: Infinity,
            dirEnd: '',
            parentStart: null,
            dirStart: '',
        };
    })));
    return cells;
}

function __buildCtx() {
    return {
        maze: maze,
        mazeW: 3,
        mazeH: 3,
        mazeD: mazeD,
        cells: __buildCells(),
        outsideCells: new Map(),
        outsideMaze: new Map(),
        accessible: new Map(),
        startCells: new Map([['0, 0, 0', [0, 0, 0]]]),
        endCells: new Map([['2, 2, 1', [2, 2, 1]]]),
        shortestPath: new Set(),
    };
}

describe('villageAnalyzer', () => {
    describe('_initMaze', () => {
        const _initMaze = Analyzer._initMaze;

        it('should build a maze of required dimension', () => {
            // square
            const maze = _initMaze(2, 2);
            expect(maze.length).toBe(2);
            expect(maze[0].length).toBe(2);

            const maze2 = _initMaze(10, 10);
            expect(maze2.length).toBe(10);
            expect(maze2[0].length).toBe(10);

            // rectangle
            const maze3 = _initMaze(10, 5);
            expect(maze3.length).toBe(10);
            expect(maze3[0].length).toBe(5);

            const maze4 = _initMaze(2, 3);
            expect(maze4.length).toBe(2);
            expect(maze4[0].length).toBe(3);
        });

        it('should have build empty cell', () => {
            // square
            const maze = _initMaze(2, 2);

            maze.forEach((row) => {
                row.forEach((cell) => {
                    expect(cell).toEqual(emptyCell);
                });
            });
        });

    });

    describe('analyze', () => {
        const analyze = Analyzer.analyze;
        const fct = Analyzer.analyzeHlp;

        describe('getId', () => {
            const getId = fct.getId;

            it('should return cell position id', () => {
                expect(getId(2, 4, 4567)).toBe('2, 4, 4567');
                expect(getId(0, 56, 1)).toBe('0, 56, 1');
            });
        });

        describe('getCell', () => {
            const getCell = fct.getCell;

            it('should return a cell from maze', () => {
                const outsideMaze = new Map();
                expect(getCell({maze, outsideMaze}, 0, 0, 0)).toEqual({
                    u: true,
                    d: false,
                    l: true,
                    r: true,
                    b: false,
                    t: false,
                });
                expect(getCell({maze, outsideMaze}, 0, 1, 0)).toEqual({
                    u: false,
                    d: false,
                    l: true,
                    r: true,
                    b: false,
                    t: false,
                });
                expect(getCell({ maze, outsideMaze }, 2, 0, 1)).toEqual({
                    u: true,
                    d: false,
                    l: true,
                    r: true,
                    b: false,
                    t: true,
                });
                expect(getCell({ maze, outsideMaze }, 0, 2, 2)).toEqual({
                    u: true,
                    d: true,
                    l: true,
                    r: false,
                    b: false,
                    t: true,
                });
            });

            it('should return a wall cell from outside maze', () => {
                const outsideMaze = new Map();
                expect(getCell({ maze, outsideMaze }, -1, 0, 0)).toEqual(wallCell);
                expect(getCell({ maze, outsideMaze }, 0, -1, 0)).toEqual(wallCell);
                expect(getCell({ maze, outsideMaze }, 0, 0, -1)).toEqual(wallCell);
                expect(getCell({ maze, outsideMaze }, 3, 0, 0)).toEqual(wallCell);
                expect(getCell({ maze, outsideMaze }, 0, 3, 0)).toEqual(wallCell);
                expect(getCell({ maze, outsideMaze }, 0, 0, mazeD)).toEqual(wallCell);
            });

            it('should return a defined cell from outside maze', () => {
                const outsideMaze = new Map([['-1, 0, 0', {
                    u: false,
                    d: true,
                    l: false,
                    r: true,
                    b: false,
                    t: false,
                }], ['0, 0, 20', {
                    u: true,
                    d: true,
                    l: false,
                    r: false,
                    b: false,
                    t: true,
                }]]);

                expect(getCell({ maze, outsideMaze }, -1, 0, 0)).toEqual({
                    u: false,
                    d: true,
                    l: false,
                    r: true,
                    b: false,
                    t: false,
                });
                expect(getCell({ maze, outsideMaze }, 0, 0, 20)).toEqual({
                    u: true,
                    d: true,
                    l: false,
                    r: false,
                    b: false,
                    t: true,
                });
            });

            it('should return a defaultCell value from outside maze', () => {
                const outsideMaze = new Map();
                const defaultValue = { toto: 42 };

                expect(getCell({ maze, outsideMaze }, -1, 0, 0, defaultValue)).toEqual(defaultValue);
                expect(getCell({ maze, outsideMaze }, 0, -1, 0, defaultValue)).toEqual(defaultValue);
                expect(getCell({ maze, outsideMaze }, 0, 0, -1, defaultValue)).toEqual(defaultValue);
                expect(getCell({ maze, outsideMaze }, 3, 0, 0, defaultValue)).toEqual(defaultValue);
                expect(getCell({ maze, outsideMaze }, 0, 3, 0, defaultValue)).toEqual(defaultValue);
                expect(getCell({ maze, outsideMaze }, 0, 0, mazeD, defaultValue)).toEqual(defaultValue);

                expect(getCell({ maze, outsideMaze }, -1, 0, 0, false)).toEqual(false);

                // assert it still works with inside cells
                expect(getCell({ maze, outsideMaze }, 0, 2, 2, defaultValue)).toEqual({
                    u: true,
                    d: true,
                    l: true,
                    r: false,
                    b: false,
                    t: true,
                });
            });
        });

        describe('getInfo', () => {
            const getInfo = fct.getInfo;
            const cells = maze.map((row, x) => row.map((col, y) => col.map((cell, z) => {
                return {
                    dist: x + y + z,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                };
            })));

            it('should get the cell information', () => {
                const outsideCells = new Map();
                expect(getInfo({cells, outsideCells}, 0, 0, 0, false)).toEqual({
                    dist: 0,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 1, 1, false)).toEqual({
                    dist: 3,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 0, 2, false)).toEqual({
                    dist: 3,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                // outside
                expect(getInfo({ cells, outsideCells }, 1, 3, 0, false)).toEqual({
                    dist: Infinity,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });
            });

            it('should return only real cell information', () => {
                const outsideCells = new Map();
                expect(getInfo({ cells, outsideCells }, 0, 0, 0, true)).toEqual({
                    dist: 0,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 2, 0, true)).toEqual({
                    dist: 3,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 3, 0, true)).toBeUndefined();
            });

            it('should return information of outside cell', () => {
                const outsideCells = new Map([['-1, 0, 0', {
                    dist: 42,
                    dirEnd: 'u',
                    parentStart: null,
                    dirStart: '',
                }], ['0, 0, 20', {
                    dist: 10,
                    dirEnd: 'd',
                    parentStart: null,
                    dirStart: '',
                }]]);

                expect(getInfo({ cells, outsideCells }, -1, 0, 0, false)).toEqual({
                    dist: 42,
                    dirEnd: 'u',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 0, 0, 20, false)).toEqual({
                    dist: 10,
                    dirEnd: 'd',
                    parentStart: null,
                    dirStart: '',
                });

                expect(getInfo({ cells, outsideCells }, 0, 0, 20, true)).toBeUndefined();
            });

            it('should keep modification', () => {
                const outsideCells = new Map([['-1, 0, 0', {
                    dist: 42,
                    dirEnd: 'u',
                    parentStart: null,
                    dirStart: '',
                }], ['0, 0, 20', {
                    dist: 10,
                    dirEnd: 'd',
                    parentStart: null,
                    dirStart: '',
                }]]);

                const info1 = getInfo({ cells, outsideCells }, 1, 2, 0, true);
                info1.dist = 33;
                expect(getInfo({ cells, outsideCells }, 1, 2, 0, true)).toEqual({
                    dist: 33,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });

                // method does not matter
                const info1bis = getInfo({ cells, outsideCells }, 2, 2, 0, true);
                info1bis.dirEnd = 'd';
                expect(getInfo({ cells, outsideCells }, 2, 2, 0, false)).toEqual({
                    dist: 4,
                    dirEnd: 'd',
                    parentStart: null,
                    dirStart: '',
                });

                const info2 = getInfo({ cells, outsideCells }, 0, 0, 20, false);
                info2.dirEnd = 'r';
                info2.dirStart = 'l';
                info2.dist = 12;
                expect(getInfo({ cells, outsideCells }, 0, 0, 20, false)).toEqual({
                    dist: 12,
                    dirEnd: 'r',
                    parentStart: null,
                    dirStart: 'l',
                });

                const info3 = getInfo({ cells, outsideCells }, 3, 0, 0, false);
                info3.dist = 42;
                info3.dirEnd = 'r';
                expect(getInfo({ cells, outsideCells }, 3, 0, 0, false)).toEqual({
                    dist: Infinity,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });
            });

        });

        describe('getDirection', () => {
            const getDirection = fct.getDirection;
            const ctx = __buildCtx();

            it('should return new position', () => {
                const rslt1 = getDirection(ctx, 1, 1, 1, 'u');
                const rslt2 = getDirection(ctx, 1, 1, 1, 'd');
                const rslt3 = getDirection(ctx, 1, 1, 1, 'l');
                const rslt4 = getDirection(ctx, 1, 1, 1, 'r');
                const rslt5 = getDirection(ctx, 1, 1, 1, 't');
                const rslt6 = getDirection(ctx, 1, 1, 1, 'b');

                const rslt10 = getDirection(ctx, 1, 0, 1, 'u');
                const rslt11 = getDirection(ctx, 2, 1, 1, 'r');
                const rslt12 = getDirection(ctx, 2, 1, 0, 't');

                expect(rslt1.slice(0, 3)).toEqual([1, 0, 1]);
                expect(rslt2.slice(0, 3)).toEqual([1, 2, 1]);
                expect(rslt3.slice(0, 3)).toEqual([0, 1, 1]);
                expect(rslt4.slice(0, 3)).toEqual([2, 1, 1]);
                expect(rslt5.slice(0, 3)).toEqual([1, 1, 0]);
                expect(rslt6.slice(0, 3)).toEqual([1, 1, 2]);

                expect(rslt10.slice(0, 3)).toEqual([1, -1, 1]);
                expect(rslt11.slice(0, 3)).toEqual([3, 1, 1]);
                expect(rslt12.slice(0, 3)).toEqual([2, 1, -1]);
            });

            it('should return information if movement is possible', () => {
                const rslt1 = getDirection(ctx, 1, 1, 1, 'u');
                const rslt2 = getDirection(ctx, 1, 1, 1, 'd');
                const rslt3 = getDirection(ctx, 1, 1, 1, 'l');
                const rslt4 = getDirection(ctx, 1, 1, 1, 'r');
                const rslt5 = getDirection(ctx, 1, 1, 1, 't');
                const rslt6 = getDirection(ctx, 1, 1, 1, 'b');
                const rslt7 = getDirection(ctx, 2, 0, 0, 'b');

                const rslt10 = getDirection(ctx, 1, 0, 1, 'u');
                const rslt11 = getDirection(ctx, 2, 1, 1, 'r');
                const rslt12 = getDirection(ctx, 2, 1, 0, 't');

                expect(rslt1[3]).toBe(false);
                expect(rslt2[3]).toBe(true);
                expect(rslt3[3]).toBe(true);
                expect(rslt4[3]).toBe(false);
                expect(rslt5[3]).toBe(false);
                expect(rslt6[3]).toBe(false);
                expect(rslt7[3]).toBe(true);

                expect(rslt10[3]).toBe(false);
                expect(rslt11[3]).toBe(false);
                expect(rslt12[3]).toBe(false);
            });
        });

        describe('computeCell', () => {
            const computeCell = fct.computeCell;
            const ctx = __buildCtx();

            beforeEach(() => {
                ctx.accessible.clear();
                ctx.cells = __buildCells();
            })

            it('should add cell to accessible', () => {
                computeCell(ctx, 0, 0, 0, 10, '0, 1, 0', 'l');
                computeCell(ctx, 1, 2, 1, 5, '1, 1, 1', 'd');
                computeCell(ctx, 2, 2, 2, 100, '1, 2, 2', 'r');

                expect(ctx.accessible.get('0, 0, 0')).toEqual([0, 0, 0]);
                expect(ctx.accessible.get('1, 2, 1')).toEqual([1, 2, 1]);
                expect(ctx.accessible.get('2, 2, 2')).toEqual([2, 2, 2]);
                expect(ctx.accessible.size).toBe(3);
            });

            it('should update info', () => {
                computeCell(ctx, 0, 0, 0, 10, '1, 0, 0', 'l');
                computeCell(ctx, 1, 2, 1, 5, '1, 1, 1', 'd');
                computeCell(ctx, 2, 2, 2, 100, '1, 2, 2', 'r');

                const info1 = fct.getInfo(ctx, 0, 0, 0, true);
                const info2 = fct.getInfo(ctx, 1, 2, 1, true);
                const info3 = fct.getInfo(ctx, 2, 2, 2, true);
                const infoOutside = fct.getInfo(ctx, 1, 0, 0, true);

                expect(info1).toEqual({
                    dist: 10,
                    dirEnd: 'l',
                    parentStart: '1, 0, 0',
                    dirStart: 'l',
                });

                expect(info2).toEqual({
                    dist: 5,
                    dirEnd: 'd',
                    parentStart: '1, 1, 1',
                    dirStart: 'd',
                });

                expect(info3).toEqual({
                    dist: 100,
                    dirEnd: 'r',
                    parentStart: '1, 2, 2',
                    dirStart: 'r',
                });

                expect(infoOutside).toEqual({
                    dist: Infinity,
                    dirEnd: '',
                    parentStart: null,
                    dirStart: '',
                });
            });

            it('should not update info when already submited', () => {
                computeCell(ctx, 1, 1, 0, 10, '0, 1, 0', 'l');
                computeCell(ctx, 1, 1, 0, 20, '1, 0, 0', 'd');

                const info1 = fct.getInfo(ctx, 1, 1, 0, true);

                expect(ctx.accessible.size).toBe(1);
                expect(info1).toEqual({
                    dist: 10,
                    dirEnd: 'l',
                    parentStart: '0, 1, 0',
                    dirStart: 'l',
                });
            });

            it('should update info when previous is farther', () => {
                computeCell(ctx, 1, 1, 0, 20, '1, 0, 0', 'd');
                computeCell(ctx, 1, 1, 0, 10, '0, 1, 0', 'l');

                const info1 = fct.getInfo(ctx, 1, 1, 0, true);

                expect(ctx.accessible.size).toBe(1);
                expect(info1).toEqual({
                    dist: 10,
                    dirEnd: 'l',
                    parentStart: '0, 1, 0',
                    dirStart: 'l',
                });
            });

            it('should return true if an update has been done', () => {
                const rslt1 = computeCell(ctx, 1, 1, 0, 20, '1, 0, 0', 'd');
                const rslt2 = computeCell(ctx, 1, 1, 0, 10, '0, 1, 0', 'l');
                const rslt3 = computeCell(ctx, 1, 1, 0, 30, '0, 0, 1', 't');
                const rslt4 = computeCell(ctx, 4, 1, 0, 30, '0, 0, 1', 't');

                expect(rslt1).toBe(true);
                expect(rslt2).toBe(true);
                expect(rslt3).toBe(false);
                expect(rslt4).toBe(false);
            });
        });

        describe('computeSibling', () => {
            const computeSibling = fct.computeSibling;
            const ctx = __buildCtx();

            beforeEach(() => {
                ctx.accessible.clear();
                ctx.cells = __buildCells();
            });

            it('should update sibling cells', () => {
                fct.getInfo(ctx, 1, 1, 0).dist = 10;
                computeSibling(ctx, 1, 1, 0);

                const info0 = fct.getInfo(ctx, 1, 1, 0);
                const infoL = fct.getInfo(ctx, 0, 1, 0);
                const infoR = fct.getInfo(ctx, 2, 1, 0);
                const infoU = fct.getInfo(ctx, 1, 0, 0);
                const infoD = fct.getInfo(ctx, 1, 2, 0);
                const infoB = fct.getInfo(ctx, 1, 1, 1);
                const infoOther = fct.getInfo(ctx, 0, 0, 0);

                expect(info0.dist).toBe(10);
                expect(infoL.dist).toBe(11);
                expect(infoR.dist).toBe(Infinity);
                expect(infoU.dist).toBe(11);
                expect(infoD.dist).toBe(11);
                expect(infoB.dist).toBe(Infinity);
                expect(infoOther.dist).toBe(Infinity);

                expect(info0.dirEnd).toBe('');
                expect(infoL.dirEnd).toBe('r');
                expect(infoR.dirEnd).toBe('');
                expect(infoU.dirEnd).toBe('d');
                expect(infoD.dirEnd).toBe('u');
                expect(infoB.dirEnd).toBe('');
                expect(infoOther.dirEnd).toBe('');

                expect(info0.parentStart).toBe(null);
                expect(infoL.parentStart).toBe('1, 1, 0');
                expect(infoR.parentStart).toBe(null);
                expect(infoU.parentStart).toBe('1, 1, 0');
                expect(infoD.parentStart).toBe('1, 1, 0');
                expect(infoB.parentStart).toBe(null);
                expect(infoOther.parentStart).toBe(null);
            });

            it('should update sibling cells through levels', () => {
                fct.getInfo(ctx, 2, 0, 1).dist = 20;
                computeSibling(ctx, 2, 0, 1);

                const infoL = fct.getInfo(ctx, 1, 0, 1);
                const infoD = fct.getInfo(ctx, 2, 1, 1);
                const infoT = fct.getInfo(ctx, 2, 0, 0);
                const infoOther = fct.getInfo(ctx, 2, 1, 0);

                expect(infoL.dist).toBe(21);
                expect(infoD.dist).toBe(Infinity);
                expect(infoT.dist).toBe(21);
                expect(infoOther.dist).toBe(Infinity);

                expect(infoL.dirEnd).toBe('r');
                expect(infoD.dirEnd).toBe('');
                expect(infoT.dirEnd).toBe('b');
                expect(infoOther.dirEnd).toBe('');

                expect(infoL.parentStart).toBe('2, 0, 1');
                expect(infoD.parentStart).toBe(null);
                expect(infoT.parentStart).toBe('2, 0, 1');
                expect(infoOther.parentStart).toBe(null);
            });

            it('should update sibling cells from outside', () => {
                computeSibling(ctx, -1, 2, 0);

                const info = fct.getInfo(ctx, 0, 2, 0);

                expect(info.dist).toBe(1);

                expect(info.dirEnd).toBe('l');

                expect(info.parentStart).toBe('-1, 2, 0');
            });

            it('should not update previous sibling cells', () => {
                computeSibling(ctx, 2, -1, 0);
                computeSibling(ctx, 2, 0, 0);
                computeSibling(ctx, 2, 1, 0);
                computeSibling(ctx, 2, 2, 0);

                const info1 = fct.getInfo(ctx, 2, 0, 0);
                const info2 = fct.getInfo(ctx, 2, 1, 0);
                const info3 = fct.getInfo(ctx, 2, 2, 0);
                const info4 = fct.getInfo(ctx, 1, 2, 0);

                expect(info1.dist).toBe(1);
                expect(info2.dist).toBe(2);
                expect(info3.dist).toBe(3);
                expect(info4.dist).toBe(4);

                expect(info1.dirEnd).toBe('u');
                expect(info2.dirEnd).toBe('u');
                expect(info3.dirEnd).toBe('u');
                expect(info4.dirEnd).toBe('r');

                expect(info1.parentStart).toBe('2, -1, 0');
                expect(info2.parentStart).toBe('2, 0, 0');
                expect(info3.parentStart).toBe('2, 1, 0');
                expect(info4.parentStart).toBe('2, 2, 0');
            });

            it('should update previous cells which are farther', () => {
                fct.getInfo(ctx, 1, 1, 1).dist = 20;
                fct.getInfo(ctx, 0, 1, 1).dist = 25;
                fct.getInfo(ctx, 1, 2, 1).dist = 15;
                computeSibling(ctx, 1, 1, 1);

                const info1 = fct.getInfo(ctx, 0, 1, 1);
                const info2 = fct.getInfo(ctx, 1, 2, 1);

                expect(info1.dist).toBe(21);
                expect(info2.dist).toBe(15);

                expect(info1.dirEnd).toBe('r');
                expect(info2.dirEnd).toBe('');

                expect(info1.parentStart).toBe('1, 1, 1');
                expect(info2.parentStart).toBe(null);
            });

            it('should return true if an update has been done', () => {
                fct.getInfo(ctx, 1, 1, 1).dist = 10;
                const rslt1 = computeSibling(ctx, 1, 1, 1);
                const rslt2 = computeSibling(ctx, 1, 1, 1);
                const rslt3 = computeSibling(ctx, -1, 2, 0);
                const rslt4 = computeSibling(ctx, 0, 3, 0);

                expect(rslt1).toBe(true);
                expect(rslt2).toBe(false);
                expect(rslt3).toBe(true);
                expect(rslt4).toBe(false);
            });
        });

        describe('computeDistance', () => {
            const computeDistance = fct.computeDistance;
            const ctx = __buildCtx();

            beforeEach(() => {
                ctx.accessible.clear();
                ctx.cells = __buildCells();
                ctx.startCells = new Map([['0, 0, 0', [0, 0, 0]]]);
                ctx.endCells = new Map([['2, 2, 1', [2, 2, 1]]]);
            });

            it('should add cells to accessible', () => {
                computeDistance(ctx);

                expect(ctx.accessible.has('0, 0, 0')).toBe(true);
                expect(ctx.accessible.has('1, 0, 0')).toBe(true);
                expect(ctx.accessible.has('0, 1, 0')).toBe(true);
                expect(ctx.accessible.has('2, 2, 1')).toBe(true);
                expect(ctx.accessible.has('1, 1, 2')).toBe(true);

                expect(ctx.accessible.has('0, 0, 2')).toBe(false);
                expect(ctx.accessible.has('3, 2, 1')).toBe(false);
            });

            it('should compute all distance', () => {
                computeDistance(ctx);

                const info1 = fct.getInfo(ctx, 0, 0, 0);
                const info2 = fct.getInfo(ctx, 0, 1, 0);
                const info3 = fct.getInfo(ctx, 1, 2, 0);
                const info4 = fct.getInfo(ctx, 2, 2, 1);
                const info5 = fct.getInfo(ctx, 1, 2, 2);
                const info6 = fct.getInfo(ctx, 2, 1, 1);
                const info7 = fct.getInfo(ctx, 2, 1, 2);

                expect(info1.dist).toBe(0);
                expect(info2.dist).toBe(3);
                expect(info3.dist).toBe(3);
                expect(info4.dist).toBe(13);
                expect(info5.dist).toBe(15);
                expect(info6.dist).toBe(14);
                expect(info7.dist).toBe(15);
            });

            it('should work for start outside maze', () => {
                ctx.startCells = new Map([['-1, 0, 0', [-1, 0, 0]]]);

                computeDistance(ctx);

                const info1 = fct.getInfo(ctx, 1, 0, 0);
                const info2 = fct.getInfo(ctx, 1, 0, 1);
                const info3 = fct.getInfo(ctx, 1, 0, 2);

                expect(ctx.accessible.has('0, 0, 0')).toBe(true);
                expect(ctx.accessible.has('2, 2, 1')).toBe(true);
                expect(ctx.accessible.has('0, 0, 2')).toBe(false);

                expect(info1.dist).toBe(2);
                expect(info2.dist).toBe(9);
                expect(info3.dist).toBe(Infinity);
            });

            it('should work with several start', () => {
                ctx.startCells = new Map([
                    ['0, 0, 0', [0, 0, 0]],
                    ['0, 2, 0', [0, 2, 0]],
                ]);

                computeDistance(ctx);

                const info1 = fct.getInfo(ctx, 1, 0, 0);
                const info2 = fct.getInfo(ctx, 1, 2, 0);
                const info3 = fct.getInfo(ctx, 2, 0, 1);

                expect(ctx.accessible.has('0, 0, 0')).toBe(true);
                expect(ctx.accessible.has('2, 2, 1')).toBe(true);

                expect(info1.dist).toBe(1);
                expect(info2.dist).toBe(1);
                expect(info3.dist).toBe(5);
            });
        });

        describe('computeDirections', () => {
            const computeDirections = fct.computeDirections;
            const computeDistance = fct.computeDistance;
            const ctx = __buildCtx();

            beforeEach(() => {
                ctx.accessible.clear();
                ctx.cells = __buildCells();
                ctx.startCells = new Map([['0, 0, 0', [0, 0, 0]]]);
                ctx.endCells = new Map([['2, 2, 1', [2, 2, 1]]]);
            });

            it('should have compute the shortest length', () => {
                ctx.endCells = new Map([['0, 2, 0', [0, 2, 0]]]);
                computeDistance(ctx);

                const lngth = computeDirections(ctx);

                expect(lngth).toBe(4);
            });

            it('should have compute the shortest length through levels', () => {
                computeDistance(ctx);
                const lngth = computeDirections(ctx);

                expect(lngth).toBe(13);
            });

            it('should have set all directions', () => {
                computeDistance(ctx);
                computeDirections(ctx);

                const info1 = fct.getInfo(ctx, 1, 1, 0, true); // on path
                const info2 = fct.getInfo(ctx, 0, 1, 1, true); // on path
                const info3 = fct.getInfo(ctx, 2, 2, 1, true); // on path
                const info4 = fct.getInfo(ctx, 2, 0, 1, true); // on path
                const info10 = fct.getInfo(ctx, 0, 1, 0, true); // outside path
                const info11 = fct.getInfo(ctx, 2, 1, 1, true); // outside path
                const info12 = fct.getInfo(ctx, 1, 1, 2, true); // outside alternate path
                const info13 = fct.getInfo(ctx, 2, 1, 2, true); // outside alternate path

                expect(info1).toEqual({
                    dist: 2,
                    dirEnd: 'd',
                    parentStart: '1, 0, 0',
                    dirStart: 'u',
                });

                expect(info2).toEqual({
                    dist: 10,
                    dirEnd: 'r',
                    parentStart: '0, 0, 1',
                    dirStart: 'u',
                });

                expect(info3).toEqual({
                    dist: 13,
                    dirEnd: 'l',
                    parentStart: '1, 2, 1',
                    dirStart: 'l',
                });

                expect(info4).toEqual({
                    dist: 7,
                    dirEnd: 'l',
                    parentStart: '2, 0, 0',
                    dirStart: 't',
                });

                expect(info10).toEqual({
                    dist: 3,
                    dirEnd: 'r',
                    parentStart: '1, 1, 0',
                    dirStart: 'r',
                });

                expect(info11).toEqual({
                    dist: 14,
                    dirEnd: 'd',
                    parentStart: '2, 2, 1',
                    dirStart: 'd',
                });

                /* Alternate path */
                expect(info12).toEqual({
                    dist: 14,
                    dirEnd: 'l',
                    parentStart: '0, 1, 2',
                    dirStart: 'l',
                });

                expect(info13).toEqual({
                    dist: 15,
                    dirEnd: 't',
                    parentStart: '2, 1, 1',
                    dirStart: 't',
                });
            });

            it('should works with several ends', () => {
                ctx.endCells = new Map([
                    ['2, 2, 1', [2, 2, 1]],
                    ['0, 2, 0', [0, 2, 0]],
                ]);
                computeDistance(ctx);

                const lngth = computeDirections(ctx);

                expect(lngth).toBe(4);

                const info1 = fct.getInfo(ctx, 1, 1, 0, true); // on path
                const info2 = fct.getInfo(ctx, 1, 2, 0, true); // on path
                const info11 = fct.getInfo(ctx, 1, 2, 1, true); // near other end

                expect(info1).toEqual({
                    dist: 2,
                    dirEnd: 'd',
                    parentStart: '1, 0, 0',
                    dirStart: 'u',
                });

                expect(info2).toEqual({
                    dist: 3,
                    dirEnd: 'l',
                    parentStart: '1, 1, 0',
                    dirStart: 'u',
                });

                expect(info11).toEqual({
                    dist: 12,
                    dirEnd: 'u',
                    parentStart: '1, 1, 1',
                    dirStart: 'u',
                });
            });
        });

        describe('move', () => {
            const move = fct.move;
            const ctx = __buildCtx();
            fct.computeDistance(ctx);

            it('should move horizontally', () => {
                const rslt1 = move(ctx, 0, 0, 0, ['u', 'r', 'b'], 1);
                const rslt2 = move(ctx, 0, 0, 2, ['d', 'r', 'b'], 1);
                const rslt3 = move(ctx, 2, 0, 2, ['u', 'l', 't'], 0);

                expect(rslt1).toEqual([1, 0, 0, 0]);
                expect(rslt2).toEqual([2, 0, 2, 0]);
                expect(rslt3).toEqual([0, 0, 2, 0]);
            });

            it('should move vertically', () => {
                const rslt1 = move(ctx, 2, 1, 0, ['d', 'r', 'b'], 1);
                const rslt2 = move(ctx, 0, 0, 1, ['d', 'l', 't'], 0);
                const rslt3 = move(ctx, 2, 2, 1, ['u', 'r', 't'], 0);

                expect(rslt1).toEqual([2, 2, 0, 0]);
                expect(rslt2).toEqual([0, 2, 1, 0]);
                expect(rslt3).toEqual([2, 1, 1, 0]);
            });

            it('should move deeply', () => {
                const rslt1 = move(ctx, 2, 0, 0, ['u', 'r', 'b'], 0);
                const rslt2 = move(ctx, 2, 1, 2, ['u', 'l', 't'], 0);
                const rslt3 = move(ctx, 0, 2, 1, ['d', 'r', 'b'], 0);

                expect(rslt1).toEqual([2, 0, 1, 0]);
                expect(rslt2).toEqual([2, 1, 1, 0]);
                expect(rslt3).toEqual([0, 2, 2, 0]);
            });

            it('should move through several directions', () => {
                const rslt1 = move(ctx, 0, 0, 0, ['d', 'r', 'b'], 0);
                const rslt2 = move(ctx, 2, 0, 1, ['d', 'l', 'b'], 0);
                const rslt3 = move(ctx, 0, 0, 1, ['u', 'r', 't'], 0);

                expect(rslt1).toEqual([2, 2, 0, 0]);
                expect(rslt2).toEqual([0, 2, 2, 0]);
                expect(rslt3).toEqual([2, 0, 0, 0]);
            });

            it('should choose from different movement', () => {
                const rslt1 = move(ctx, 1, 2, 2, ['u', 'r', 'b'], 0);
                const rslt2 = move(ctx, 1, 2, 2, ['u', 'r', 'b'], 1);

                const rslt11 = move(ctx, 2, 1, 2, ['d', 'r', 't'], 0);
                const rslt12 = move(ctx, 2, 1, 2, ['d', 'r', 't'], 1);

                expect(rslt1).toEqual([2, 1, 2, 1]);
                expect(rslt2).toEqual([1, 1, 2, 1]);

                expect(rslt11).toEqual([2, 2, 1, 1]);
                expect(rslt12).toEqual([2, 2, 1, 1]);
            });

            it('should do complex movement', () => {
                const rslt1 = move(ctx, 0, 2, 0, ['u', 'r', 'b'], 0);
                const rslt2 = move(ctx, 2, 2, 0, ['u', 'l', 'b'], 0);
                const rslt3 = move(ctx, 2, 2, 0, ['u', 'l', 'b'], 1);
                const rslt4 = move(ctx, 0, 0, 3, ['d', 'r', 'b'], 1);

                expect(rslt1).toEqual([1, 0, 0, 1]);
                expect(rslt2).toEqual([0, 1, 0, 3]);
                expect(rslt3).toEqual([0, 0, 1, 1]);
                expect(rslt4).toEqual([2, 2, 4, 3]);
            });
        });

        describe('computeOneMovement', () => {
            const computeOneMovement = fct.computeOneMovement;
            const ctx = __buildCtx();
            fct.computeDistance(ctx);
            fct.computeDirections(ctx);

            it('should do normal movement', () => {
                const options = { normal: true, opposite: false, reverse: false };
                const rslt1 = computeOneMovement(ctx, 1, 0, 0, ['u', 'r', 'b'], options);
                const rslt2 = computeOneMovement(ctx, 0, 0, 3, ['u', 'r', 'b'], options);
                const rslt3 = computeOneMovement(ctx, 0, 0, 3, ['u', 'l', 'b'], options);
                const rslt4 = computeOneMovement(ctx, 2, 2, 4, ['d', 'r', 'b'], options);
                const rslt5 = computeOneMovement(ctx, 0, 1, 0, ['d', 'l', 't'], options);
                const rslt6 = computeOneMovement(ctx, 2, 0, 1, ['d', 'r', 'b'], options);
                const options2 = { normal: false, opposite: false, reverse: false };
                const rslt10 = computeOneMovement(ctx, 1, 0, 0, ['u', 'r', 'b'], options);

                expect(rslt1).toEqual([2, 2, 0, 0, 0, ['d', 'r', 'b'], 'd', '2, 2, 0']);
                expect(rslt2).toEqual([2, 2, 4, 2, 0, ['d', 'r', 'b'], 'd', '2, 2, 4']);
                expect(rslt3).toEqual([0, 2, 4, 0, 0, ['d', 'l', 'b'], 'd', '0, 2, 4']);
                expect(rslt4).toEqual([1, 2, 4, 0, 0, ['d', 'l', 'b'], 'l', '1, 2, 4']);
                expect(rslt5).toEqual([2, 2, 0, 0, 0, ['d', 'r', 't'], 'r', '2, 2, 0']);
                expect(rslt6).toEqual([0, 2, 2, 0, 0, ['d', 'l', 'b'], 'l', '0, 2, 2']);

                expect(rslt10).toEqual([2, 2, 0, 0, 0, ['d', 'r', 'b'], 'd', '2, 2, 0']);
            });

            it('should do opposite movement', () => {
                const options = { normal: false, opposite: true, reverse: false };
                const rslt1 = computeOneMovement(ctx, 1, 0, 0, ['u', 'r', 'b'], options);
                const rslt2 = computeOneMovement(ctx, 0, 0, 3, ['u', 'r', 'b'], options);
                const rslt3 = computeOneMovement(ctx, 0, 0, 3, ['u', 'l', 'b'], options);
                const rslt4 = computeOneMovement(ctx, 2, 2, 4, ['d', 'r', 'b'], options);
                const rslt5 = computeOneMovement(ctx, 0, 1, 0, ['d', 'l', 't'], options);
                const rslt6 = computeOneMovement(ctx, 2, 0, 1, ['d', 'r', 'b'], options);

                expect(rslt1).toEqual([0, 0, 0, 0, 0, ['u', 'l', 'b'], 'l', '0, 0, 0']);
                expect(rslt2).toEqual([0, 0, 3, 0, 0, ['u', 'l', 'b'], 'l', '0, 0, 3']);
                expect(rslt3).toEqual([0, 0, 3, 0, 0, ['u', 'r', 'b'], 'r', '0, 0, 3']);
                expect(rslt4).toEqual([2, 0, 4, 0, 0, ['u', 'r', 'b'], 'u', '2, 0, 4']);
                expect(rslt5).toEqual([0, 1, 0, 0, 0, ['u', 'l', 't'], 'u', '0, 1, 0']);
                expect(rslt6).toEqual([2, 0, 1, 0, 0, ['u', 'r', 'b'], 'u', '2, 0, 1']);
            });

            it('should do deep movement', () => {
                const options = { normal: false, opposite: false, reverse: true };
                const rslt1 = computeOneMovement(ctx, 1, 0, 0, ['u', 'r', 'b'], options);
                const rslt2 = computeOneMovement(ctx, 0, 0, 3, ['u', 'r', 't'], options);
                const rslt3 = computeOneMovement(ctx, 2, 0, 1, ['d', 'r', 'b'], options);
                const rslt4 = computeOneMovement(ctx, 0, 2, 1, ['d', 'l', 't'], options);

                expect(rslt1).toEqual([1, 0, 0, 0, 0, ['u', 'r', 't'], 't', '1, 0, 0']);
                expect(rslt2).toEqual([0, 0, 3, 0, 0, ['u', 'r', 'b'], 'b', '0, 0, 3']);
                expect(rslt3).toEqual([2, 2, 0, 0, 0, ['d', 'r', 't'], 't', '2, 2, 0']);
                expect(rslt4).toEqual([0, 2, 2, 0, 0, ['d', 'l', 'b'], 'b', '0, 2, 2']);
            });

            it('should do complex movement', () => {
                const options = { normal: true, opposite: true, reverse: false };
                const rslt1 = computeOneMovement(ctx, 2, 2, 0, ['d', 'r', 'b'], options);
                const rslt2 = computeOneMovement(ctx, 0, 0, 1, ['u', 'l', 'b'], options);

                expect(rslt1).toEqual([0, 0, 1, 0, 1, ['u', 'l', 'b'], 'ul', '0, 0, 1']);
                expect(rslt2).toEqual([2, 2, 1, 1, 1, ['d', 'r', 'b'], 'dr', '2, 2, 1']);

                const options2 = { normal: true, opposite: false, reverse: true };
                const rslt21 = computeOneMovement(ctx, 2, 2, 0, ['d', 'r', 't'], options2);
                const rslt22 = computeOneMovement(ctx, 0, 0, 3, ['u', 'l', 'b'], options2);

                expect(rslt21).toEqual([2, 0, 1, 0, 1, ['u', 'r', 'b'], 'ub', '2, 0, 1']);
                expect(rslt22).toEqual([0, 2, 1, 0, 1, ['d', 'l', 't'], 'dt', '0, 2, 1']);

                const options3 = { normal: false, opposite: true, reverse: true };
                const rslt31 = computeOneMovement(ctx, 1, 2, 1, ['d', 'l', 't'], options3);
                const rslt32 = computeOneMovement(ctx, 1, 2, 2, ['d', 'l', 'b'], options3);

                expect(rslt31).toEqual([0, 0, 1, 0, 1, ['u', 'l', 'b'], 'ub', '0, 0, 1']);
                expect(rslt32).toEqual([2, 2, 2, 0, 1, ['d', 'r', 't'], 'rt', '2, 2, 2']);

                const options4 = { normal: true, opposite: true, reverse: true };
                const rslt41 = computeOneMovement(ctx, 1, 0, 3, ['u', 'l', 't'], options4);
                const rslt42 = computeOneMovement(ctx, 0, 0, 4, ['u', 'l', 'b'], options4);

                expect(rslt41).toEqual([2, 2, 3, 0, 2, ['d', 'r', 'b'], 'drb', '2, 2, 3']);
                expect(rslt42).toEqual([2, 2, 2, 2, 2, ['d', 'r', 't'], 'drt', '2, 2, 2']);
            });

            it('should not modify position', () => {
                const position = ['u', 'l', 'b'];
                const options = { normal: false, opposite: false, reverse: false };
                computeOneMovement(ctx, 2, 2, 0, position, options);

                expect(position).toEqual(['u', 'l', 'b']);
            });
        });

        xdescribe('computeMovements', () => {
            const computeMovements = fct.computeMovements;
            const ctx = __buildCtx();
            fct.computeDistance(ctx);
        });

        xdescribe('addOutside', () => {
            const addOutside = fct.addOutside;
        });
    });
});

/*
describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelectorAll('.menu a').length)
      .toBe(2)
  })
})
*/
