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
 * |  _ ↑|
 * |   |_|
 * |_|___|
 */
const mazeLvl02 = Analyzer._initMaze(3, 3);
mazeLvl02[1][0].d = false;
mazeLvl02[2][0].t = true;
mazeLvl02[1][1].u = false;
mazeLvl02[1][1].r = false;
mazeLvl02[2][1].l = false;
mazeLvl02[2][1].d = false;
mazeLvl02[0][2].r = false;
mazeLvl02[1][2].l = false;
mazeLvl02[2][2].u = false;

const maze = mazeLvl01.map((row, x) => row.map((cell, y) => [cell, mazeLvl02[x][y]]));

function __buildCells() {
    const cells = maze.map((row, x) => row.map((col, y) => col.map((cell, z) => {
        return {
            dist: Infinity,
            orientation: '',
            parent: null,
            dirParent: '',
        };
    })));
    return cells;
}

function __buildCtx() {
    return {
        maze: maze,
        mazeW: 3,
        mazeH: 3,
        mazeD: 2,
        cells: __buildCells(),
        outsideCells: new Map(),
        outsideMaze: new Map(),
        accessible: new Map(),
        startCells: new Map([['0, 0, 0', [0, 0, 0]]]),
        endCells: new Map([['2, 2, 1', [2, 2, 1]]]),
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
                    d: true,
                    l: true,
                    r: true,
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
                expect(getCell({ maze, outsideMaze }, 0, 0, 2)).toEqual(wallCell);
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
        });

        describe('getInfo', () => {
            const getInfo = fct.getInfo;
            const cells = maze.map((row, x) => row.map((col, y) => col.map((cell, z) => {
                return {
                    dist: x + y + z,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                };
            })));

            it('should get the cell information', () => {
                const outsideCells = new Map();
                expect(getInfo({cells, outsideCells}, 0, 0, 0, false)).toEqual({
                    dist: 0,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 1, 1, false)).toEqual({
                    dist: 3,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 3, 0, false)).toEqual({
                    dist: Infinity,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });
            });

            it('should return only real cell information', () => {
                const outsideCells = new Map();
                expect(getInfo({ cells, outsideCells }, 0, 0, 0, true)).toEqual({
                    dist: 0,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 2, 0, true)).toEqual({
                    dist: 3,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 1, 3, 0, true)).toBeUndefined();
            });

            it('should return information of outside cell', () => {
                const outsideCells = new Map([['-1, 0, 0', {
                    dist: 42,
                    orientation: 'u',
                    parent: null,
                    dirParent: '',
                }], ['0, 0, 20', {
                    dist: 10,
                    orientation: 'd',
                    parent: null,
                    dirParent: '',
                }]]);

                expect(getInfo({ cells, outsideCells }, -1, 0, 0, false)).toEqual({
                    dist: 42,
                    orientation: 'u',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 0, 0, 20, false)).toEqual({
                    dist: 10,
                    orientation: 'd',
                    parent: null,
                    dirParent: '',
                });

                expect(getInfo({ cells, outsideCells }, 0, 0, 20, true)).toBeUndefined();
            });

            it('should keep modification', () => {
                const outsideCells = new Map([['-1, 0, 0', {
                    dist: 42,
                    orientation: 'u',
                    parent: null,
                    dirParent: '',
                }], ['0, 0, 20', {
                    dist: 10,
                    orientation: 'd',
                    parent: null,
                    dirParent: '',
                }]]);

                const info1 = getInfo({ cells, outsideCells }, 1, 2, 0, true);
                info1.dist = 33;
                expect(getInfo({ cells, outsideCells }, 1, 2, 0, true)).toEqual({
                    dist: 33,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });

                // method does not matter
                const info1bis = getInfo({ cells, outsideCells }, 2, 2, 0, true);
                info1bis.orientation = 'd';
                expect(getInfo({ cells, outsideCells }, 2, 2, 0, false)).toEqual({
                    dist: 4,
                    orientation: 'd',
                    parent: null,
                    dirParent: '',
                });

                const info2 = getInfo({ cells, outsideCells }, 0, 0, 20, false);
                info2.orientation = 'r';
                info2.dirParent = 'l';
                info2.dist = 12;
                expect(getInfo({ cells, outsideCells }, 0, 0, 20, false)).toEqual({
                    dist: 12,
                    orientation: 'r',
                    parent: null,
                    dirParent: 'l',
                });

                const info3 = getInfo({ cells, outsideCells }, 3, 0, 0, false);
                info3.dist = 42;
                info3.orientation = 'r';
                expect(getInfo({ cells, outsideCells }, 3, 0, 0, false)).toEqual({
                    dist: Infinity,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });
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

                expect(ctx.accessible.get('0, 0, 0')).toEqual([0, 0, 0]);
                expect(ctx.accessible.get('1, 2, 1')).toEqual([1, 2, 1]);
                expect(ctx.accessible.size).toBe(2);
            });

            it('should update info', () => {
                computeCell(ctx, 0, 0, 0, 10, '1, 0, 0', 'l');
                computeCell(ctx, 1, 2, 1, 5, '1, 1, 1', 'd');

                const info1 = fct.getInfo(ctx, 0, 0, 0, true);
                const info2 = fct.getInfo(ctx, 1, 2, 1, true);
                const info3 = fct.getInfo(ctx, 1, 0, 0, true);

                expect(info1).toEqual({
                    dist: 10,
                    orientation: 'l',
                    parent: '1, 0, 0',
                    dirParent: 'l',
                });

                expect(info2).toEqual({
                    dist: 5,
                    orientation: 'd',
                    parent: '1, 1, 1',
                    dirParent: 'd',
                });

                expect(info3).toEqual({
                    dist: Infinity,
                    orientation: '',
                    parent: null,
                    dirParent: '',
                });
            });

            it('should not update info when already submited', () => {
                computeCell(ctx, 1, 1, 0, 10, '0, 1, 0', 'l');
                computeCell(ctx, 1, 1, 0, 20, '1, 0, 0', 'd');

                const info1 = fct.getInfo(ctx, 1, 1, 0, true);

                expect(ctx.accessible.size).toBe(1);
                expect(info1).toEqual({
                    dist: 10,
                    orientation: 'l',
                    parent: '0, 1, 0',
                    dirParent: 'l',
                });
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

                expect(info0.orientation).toBe('');
                expect(infoL.orientation).toBe('r');
                expect(infoR.orientation).toBe('');
                expect(infoU.orientation).toBe('d');
                expect(infoD.orientation).toBe('u');
                expect(infoB.orientation).toBe('');
                expect(infoOther.orientation).toBe('');

                expect(info0.parent).toBe(null);
                expect(infoL.parent).toBe('1, 1, 0');
                expect(infoR.parent).toBe(null);
                expect(infoU.parent).toBe('1, 1, 0');
                expect(infoD.parent).toBe('1, 1, 0');
                expect(infoB.parent).toBe(null);
                expect(infoOther.parent).toBe(null);
            });

            it('should update sibling cells through levels', () => {
                fct.getInfo(ctx, 2, 0, 1).dist = 20;
                computeSibling(ctx, 2, 0, 1);

                const infoL = fct.getInfo(ctx, 1, 0, 1);
                const infoD = fct.getInfo(ctx, 2, 1, 1);
                const infoT = fct.getInfo(ctx, 2, 0, 0);
                const infoOther = fct.getInfo(ctx, 2, 1, 0);

                expect(infoL.dist).toBe(21);
                expect(infoD.dist).toBe(21);
                expect(infoT.dist).toBe(21);
                expect(infoOther.dist).toBe(Infinity);

                expect(infoL.orientation).toBe('r');
                expect(infoD.orientation).toBe('u');
                expect(infoT.orientation).toBe('b');
                expect(infoOther.orientation).toBe('');

                expect(infoL.parent).toBe('2, 0, 1');
                expect(infoD.parent).toBe('2, 0, 1');
                expect(infoT.parent).toBe('2, 0, 1');
                expect(infoOther.parent).toBe(null);
            });

            it('should update sibling cells from outside', () => {
                computeSibling(ctx, -1, 2, 0);

                const info = fct.getInfo(ctx, 0, 2, 0);

                expect(info.dist).toBe(1);

                expect(info.orientation).toBe('l');

                expect(info.parent).toBe('-1, 2, 0');
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

                expect(info1.orientation).toBe('u');
                expect(info2.orientation).toBe('u');
                expect(info3.orientation).toBe('u');
                expect(info4.orientation).toBe('r');

                expect(info1.parent).toBe('2, -1, 0');
                expect(info2.parent).toBe('2, 0, 0');
                expect(info3.parent).toBe('2, 1, 0');
                expect(info4.parent).toBe('2, 2, 0');
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

            xit('should add cells to accessible', () => {});

            xit('should compute all distance', () => {});

            xit('should work for start outside maze', () => {});
        });

        xdescribe('move', () => {
            const move = fct.move;
        });

        xdescribe('computeDirections', () => {
            const computeDirections = fct.computeDirections;
            const ctx = __buildCtx();

            beforeEach(() => {
                ctx.accessible.clear();
                ctx.cells = __buildCells();
                ctx.endCells = new Map([['2, 2, 1', [2, 2, 1]]]);
            });

            it('should have compute the shortest length', () => {
                ctx.endCells = new Map([['0, 2, 0', [0, 2, 0]]]);
                const lngth = computeDirections(ctx);

                expect(lngth).toBe(4);
            });

            it('should have compute the shortest length through levels', () => {
                const lngth = computeDirections(ctx);

                expect(lngth).toBe(13);
            });

            it('should have set all directions', () => {
                computeDirections(ctx);

                const info1 = fct.getInfo(ctx, 1, 1, 0, true); // on path
                const info2 = fct.getInfo(ctx, 0, 1, 1, true); // on path
                const info3 = fct.getInfo(ctx, 2, 2, 1, true); // on path
                const info4 = fct.getInfo(ctx, 2, 0, 1, true); // on path
                const info10 = fct.getInfo(ctx, 0, 1, 0, true); // outside path
                const info11 = fct.getInfo(ctx, 2, 1, 1, true); // outside path

                expect(info1).toEqual({
                    dist: 10,
                    orientation: 'd',
                    parent: '1, 0, 0',
                    dirParent: 'd',
                });

                expect(info2).toEqual({
                    dist: 3,
                    orientation: 'r',
                    parent: '0, 0, 1',
                    dirParent: 'd',
                });

                expect(info3).toEqual({
                    dist: 0,
                    orientation: 'r',
                    parent: '1, 2, 1',
                    dirParent: 'r',
                });

                expect(info4).toEqual({
                    dist: 6,
                    orientation: 'l',
                    parent: '2, 0, 0',
                    dirParent: 'b',
                });

                expect(info10).toEqual({
                    dist: 11,
                    orientation: 'r',
                    parent: '1, 1, 0',
                    dirParent: 'd',
                });

                expect(info11).toEqual({
                    dist: 7,
                    orientation: 'u',
                    parent: '2, 0, 1',
                    dirParent: 'l',
                });
            });
        });

        xdescribe('computeOneMovement', () => {
            const computeOneMovement = fct.computeOneMovement;
        });

        xdescribe('computeMovements', () => {
            const computeMovements = fct.computeMovements;
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
