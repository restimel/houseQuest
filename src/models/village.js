import Vue from 'vue';
import store from '@/core/indexedDB';
import worker from '@/core/worker';
import House from '@/models/house';
import conf from '@/models/configurations';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

let workerLimitation = 4;
const waitWorkerRetry = 200;

const Village = Vue.component('Village', {
    props: {
        synchronized: {
            type: Boolean,
            default: false,
        },
        initMaze: {
            type: Array,
            required: false,
            default: function() {
                return [];
            },
        },
        withoutAnalyze: {
            type: Boolean,
            default: false,
        },
        forceAnalyze: {
            type: Boolean,
            default: true,
        },
        result: {
            type: Object,
            required: false,
        },
        starts: {
            type: Array,
            default: () => {
                return confVillage.starts.slice();
            },
        },
        ends: {
            type: Array,
            default: () => {
                return confVillage.ends.slice();
            },
        },
    },
    data: function() {
        this.updateDate = 0;
        this.createDate = 0;

        this.$nextTick(() => {
            this.infos = this._initInfos();
        });

        return {
            name: '',
            maze: this.initMaze || [],
            houses: [],
            infos: [],
            defaultInfo: this._getInitInfo({}, true),
            analyzeResult: {},
            conf: conf,
            disablingOutsideCells: [],
            listStart: this.starts.slice(),
            listEnd: this.ends.slice(),
            sizeX: confVillage.sizeX,
            sizeY: confVillage.sizeY,
            sizeZ: confVillage.sizeZ,
        };
    },
    computed: {
        startCells: function() {
            return this.listStart.filter(cell => !this.disablingOutsideCells.includes(cell));
        },
        endCells: function() {
            return this.listEnd.filter(cell => !this.disablingOutsideCells.includes(cell));
        },
        isAnalyzeResultEmpty: function() {
        const analyzeResult = this.analyzeResult;
            return Object.keys(analyzeResult).length === 0;
        },
    },
    methods: {
        get: async function(name, asDefault = false) {
            const keepInfo = name === '§¤§infos§';

            if (asDefault) {
                await this.conf.isLoaded;
                if (this.conf.villageName) {
                    name = this.conf.villageName;
                }
            }
            if (!name) {
                this.clear();
                return;
            }
            if (keepInfo) {
                this.clear(true);
                return;
            }
            this.name = name;
            this.analyzeResult = {};
            let village = await store.village.get(name);

            village = Object.assign({
                name: name,
                houses: [],
                updateDate: 0,
                createDate: 0,
                starts: confVillage.starts,
                ends: confVillage.ends,
            }, village);


            if (village.size) {
                const sizes = village.size.split('×');
                this.sizeX = +sizes[0];
                this.sizeY = +sizes[1];
                this.sizeZ = +sizes[2];
            } else {
                this.sizeX = confVillage.sizeX;
                this.sizeY = confVillage.sizeY;
                this.sizeZ = confVillage.sizeZ;
            }

            this.name = village.name;
            this.houses = village.houses;
            this.infos = this._initInfos(village.infos);
            this.defaultInfo = this._getInitInfo(village.defaultInfo, true);
            this.updateDate = village.updateDate;
            this.createDate = village.createDate;
            this.listStart = village.starts.slice();
            this.listEnd = village.ends.slice();

            if (!asDefault) {
                this.sync();
            }
        },
        getList: async function() {
            const villages = await store.village.getAll();
            return villages;
        },
        save: function() {
            const p = store.village.set({
                name: this.name,
                maze: this.maze,
                houses: this.houses,
                infos: this.infos,
                defaultInfo: this.defaultInfo,
                updateDate: this.updateDate,
                createDate: this.createDate,
                starts: this.listStart,
                ends: this.listEnd,
                size: `${this.sizeX}×${this.sizeY}×${this.sizeZ}`,
            });

            p.then(() => this.sync());

            return p;
        },
        delete: async function() {
            await store.village.delete(this.name);

            this.clear();
            this.sync(true);
        },
        sync: function(forceEmpty = false) {
            if (this.synchronized && (this.name || forceEmpty)) {
                this.conf.villageName = this.name;
            }
        },
        clear: function(keepInfos = false) {
            this.name = '';
            this.maze = [];
            this.houses = [];
            this.analyzeResult = {};
            if (!keepInfos) {
                this.infos = this._initInfos();
                this.defaultInfo = this._getInitInfo({}, true);
            }

            const length = this.sizeX * this.sizeY * this.sizeZ;
            for (let x = 0; x < length; x++) {
                this.houses.push('_empty_§UP');
            }
        },
        analyze: function(result) {
            result.shortestPath = new Set(result.shortestPath);
            this.analyzeResult = result;
            this.$emit('analyze:done', result);
        },
        toggleOutsideCell: function(cell) {
            const idx = this.disablingOutsideCells.indexOf(cell);

            if (idx === -1) {
                this.disablingOutsideCells.push(cell);
            } else {
                this.disablingOutsideCells.splice(idx, 1);
            }

            this._runAnalyze();
        },
        setInfos: function(infos) {
            this.infos = this._initInfos(infos);
        },
        setDefaultInfos: function (infos) {
            this.defaultInfo = infos;
        },
        _getInitInfo: function(obj = {}, isDefault = false) {
            const defaultOrientation = isDefault ? ['UP'] : [];
            return Object.assign({
                houses: [],
                orientations: defaultOrientation,
            }, obj);
        },
        _initInfos: function(initValue = []) {
            const length = this.sizeX * this.sizeY;
            const infos = this.infos || new Array(length);

            for (let x = 0; x < length; x++) {
                const initialValue = initValue[x];
                infos[x] = this._getInitInfo(initialValue);
            }
            return infos;
        },
        _initMaze: function() {
            const xLength = this.sizeX * confHouse.sizeX;
            const yLength = this.sizeY * confHouse.sizeY;
            const zLength = this.sizeZ;

            const maze = new Array(xLength);
            for (let x = 0; x < xLength; x++) {
                const column = new Array(yLength)
                maze[x] = column;
                for (let y = 0; y < yLength; y++) {
                    const cells = new Array(zLength);
                    column[y] = cells;
                    for (let z = 0; z < zLength; z++) {
                        cells[z] = {
                            u: true,
                            d: true,
                            l: true,
                            r: true,
                            b: false,
                            t: false,
                        };
                    }
                }
            }

            this.maze = maze;
        },
        _initValue: async function() {
            if (this.synchronized) {
                if (!this.name) {
                    if (this.conf.villageName) {
                        this.get(this.conf.villageName);
                    } else {
                        this.clear();
                    }
                }
            }
        },
        _runAnalyze: function() {
            if (!this.withoutAnalyze && (this.forceAnalyze || this.isAnalyzeResultEmpty)) {
                const workerAnalyze = () => {
                    if (workerLimitation > 0) {
                        workerLimitation--;
                        worker('analyze', {
                            maze: this.maze,
                            starts: this.startCells,
                            ends: this.endCells,
                        }).then((result) => {
                            workerLimitation++;
                            this.analyze(result);
                        });
                    } else {
                        setTimeout(workerAnalyze, waitWorkerRetry);
                    }
                };
                workerAnalyze();
            }
        },
    },
    watch: {
        result: function(result) {
            this.analyzeResult = result;
        },
        starts: function() {
            this.listStart = this.starts.slice();
            this._runAnalyze();
        },
        ends: function() {
            this.listEnd = this.ends.slice();
            this._runAnalyze();
        },
        houses: async function() {
            const houses = this.houses;
            const confVillageSizeX = this.sizeX;
            const confVillageSizeY = this.sizeY;
            const confVillageSizeZ = this.sizeZ;
            const houseMaze = new Array(confVillageSizeX);
            const promises = [];

            this._initMaze();

            for (let x = 0; x < confVillageSizeX; x++) {
                houseMaze[x] = new Array(confVillageSizeY);
                for (let y = 0; y < confVillageSizeY; y++) {
                    houseMaze[x][y] = new Array(confVillageSizeZ);
                    for (let z = 0; z < confVillageSizeZ; z++) {
                        const house = new House();
                        houseMaze[x][y][z] = house;
                        const cellHouse = houses[x * confVillageSizeY + y + z * confVillageSizeY * confVillageSizeX];
                        const [houseName, orientation] = (cellHouse || '').split('§');
                        house.orientation = orientation;
                        promises.push(house.get(houseName));
                    }
                }
            }

            await Promise.all(promises);
            const xLength = confVillageSizeX * confHouse.sizeX;
            const yLength = confVillageSizeY * confHouse.sizeY;
            const zLength = confVillageSizeZ;

            const getCell = (x, y, z) => {
                const villageX = Math.floor(x / confHouse.sizeX);
                const houseX = x % confHouse.sizeX;
                const villageY = Math.floor(y / confHouse.sizeY);
                const houseY = y % confHouse.sizeY;
                const villageZ = z;

                const houseMazeX = houseMaze[villageX];
                if (houseMazeX && houseMazeX[villageY] && houseMazeX[villageY][villageZ]) {
                    return houseMazeX[villageY][villageZ].getCell(houseX, houseY);
                }

                if (this.listStart.includes(`${x}, ${y}, ${z}`) || this.listEnd.includes(`${x}, ${y}, ${z}`)) {
                    return {
                        u: true, // up
                        d: true, // down
                        l: true, // left
                        r: true, // right
                        b: false, // bottom
                        t: false, // top
                    };
                }
                // false → wall | true → passage
                return {
                    u: false, // up
                    d: false, // down
                    l: false, // left
                    r: false, // right
                    b: false, // bottom
                    t: false, // top
                };
            }

            const maze = this.maze;
            for (let x = 0; x < xLength; x++) {
                for (let y = 0; y < yLength; y++) {
                    for (let z = 0; z < zLength; z++) {
                        const cell0 = getCell(x, y, z);
                        const cell = {
                            u: cell0.u && getCell(x, y - 1, z).d, // up
                            d: cell0.d && getCell(x, y + 1, z).u, // down
                            l: cell0.l && getCell(x - 1, y, z).r, // left
                            r: cell0.r && getCell(x + 1, y, z).l, // right
                            b: cell0.b && z < zLength - 1, // bottom (this information set the top information of opposing cell)
                            t: getCell(x, y, z - 1).b, // top (this is a soft information)
                        };
                        maze[x][y][z] = cell;
                    }
                }
            }
            this._runAnalyze();
            this.$emit('maze_change');
        },
    },
});

export default Village;
