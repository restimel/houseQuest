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
    },
    data: function() {
        return {
            name: '',
            maze: this.initMaze || [],
            houses: [],
            infos: this._initInfos(),
            defaultInfo: this._getInitInfo(true),
            updateDate: 0,
            createDate: 0,
            analyzeResult: {},
            conf: conf,
            disablingOutsideCells: [],
        };
    },
    computed: {
        starts: function() {
            return confVillage.starts.filter(cell => !this.disablingOutsideCells.includes(cell));
        },
        ends: function() {
            return confVillage.ends.filter(cell => !this.disablingOutsideCells.includes(cell));
        },
        isAnalyzeResultEmpty: function() {
            const analyzeResult = this.analyzeResult;
            return Object.keys(analyzeResult).length === 0;
        }
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
            if (!village) {
                village = {
                    name: name,
                    houses: [],
                    updateDate: 0,
                    createDate: 0,
                };
            }
            this.name = village.name;
            this.houses = village.houses;
            this.infos = village.infos || this._initInfos();
            this.defaultInfo = village.defaultInfo || this._getInitInfo(true);
            this.updateDate = village.updateDate;
            this.createDate = village.createDate;

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
                this.defaultInfo = this._getInitInfo(true);
            }

            const length = confVillage.sizeX * confVillage.sizeY;
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
        _getInitInfo: function(isDefault = false) {
            const defaultOrientation = isDefault ? ['UP'] : [];
            return {
                houses: [],
                orientations: defaultOrientation,
            };
        },
        _initInfos: function() {
            const length = confVillage.sizeX * confVillage.sizeY;
            const infos = this.infos || new Array(length);

            for (let x = 0; x < length; x++) {
                infos[x] = this._getInitInfo();
            }
            return infos;
        },
        _initMaze: function() {
            const xLength = confVillage.sizeX * confHouse.sizeX;
            const yLength = confVillage.sizeY * confHouse.sizeY;

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
                            starts: this.starts,
                            ends: this.ends,
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
        houses: async function() {
            const houses = this.houses;
            const confVillageSizeX = confVillage.sizeX;
            const confVillageSizeY = confVillage.sizeY;
            const houseMaze = new Array(confVillageSizeX);
            const promises = [];

            this._initMaze();

            for (let x = 0; x < confVillageSizeX; x++) {
                houseMaze[x] = new Array(confVillageSizeY);
                for (let y = 0; y < confVillageSizeY; y++) {
                    const house = new House();
                    houseMaze[x][y] = house;
                    const cellHouse = houses[x * confVillageSizeX + y];
                    const [houseName, orientation] = (cellHouse || '').split('§');
                    house.orientation = orientation;
                    promises.push(house.get(houseName));
                }
            }

            await Promise.all(promises);
            const xLength = confVillageSizeX * confHouse.sizeX;
            const yLength = confVillageSizeY * confHouse.sizeY;

            const getCell = (x, y) => {
                const villageX = Math.floor(x / confHouse.sizeX)
                const houseX = x % confHouse.sizeX;
                const villageY = Math.floor(y / confHouse.sizeY)
                const houseY = y % confHouse.sizeY;

                const houseMazeX = houseMaze[villageX];
                if (houseMazeX && houseMazeX[villageY]) {
                    return houseMazeX[villageY].getCell(houseX, houseY);
                }

                if (confVillage.starts.includes(`${x}, ${y}`) || confVillage.ends.includes(`${x}, ${y}`)) {
                    return {
                        u: true, // up
                        d: true, // down
                        l: true, // left
                        r: true, // right
                    };
                }
                return {
                    u: false, // up
                    d: false, // down
                    l: false, // left
                    r: false, // right
                };
            }

            const maze = this.maze;
            for (let x = 0; x < xLength; x++) {
                for (let y = 0; y < yLength; y++) {
                    const cell0 = getCell(x, y);
                    const cell = {
                        u: cell0.u && getCell(x, y - 1).d, // up
                        d: cell0.d && getCell(x, y + 1).u, // down
                        l: cell0.l && getCell(x - 1, y).r, // left
                        r: cell0.r && getCell(x + 1, y).l, // right
                    };
                    maze[x][y] = cell;
                }
            }
            this._runAnalyze();
            this.$emit('maze_change');
        },
    },
});

export default Village;
