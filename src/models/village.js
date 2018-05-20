import Vue from 'vue';
import store from '@/core/indexedDB';
import worker from '@/core/worker';
import House from '@/models/house';
import conf from '@/models/configurations';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

const Village = Vue.component('Village', {
    props: {
        synchronized: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            name: '',
            maze: [],
            houses: [],
            updateDate: 0,
            createDate: 0,
            analyzeResult: {},
            conf: conf,
        };
    },
    methods: {
        get: async function(name, asDefault = false) {
            if (asDefault) {
                await this.conf.isLoaded;
                if (this.conf.villageName) {
                    name = this.conf.villageName;
                }
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
                }
            }
            this.name = village.name;
            this.houses = village.houses;
            this.updateDate = village.updateDate;
            this.createDate = village.createDate;

            if (!asDefault) {
                this.sync();
            }
        },
        save: function() {
            return store.village.set({
                name: this.name,
                maze: this.maze,
                houses: this.houses,
                updateDate: this.updateDate,
                createDate: this.createDate,
            });

            this.sync();
        },
        sync: function() {
            if (this.synchronized && this.name) {
                this.conf.villageName = this.name;
            }
        },
        analyze: function(result) {
            console.log(performance.now() - self.dbg);
            result.shortestPath = new Set(result.shortestPath);
            this.analyzeResult = result;
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
                if (!this.name && this.conf.villageName) {
                    this.get(this.conf.villageName);
                }
            }
        },
    },
    watch: {
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
                    const [houseName, orientation] = (houses[x * confVillageSizeX + y] || '').split('§');
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
                        r: true, //right
                    };
                }
                return {
                    u: false, // up
                    d: false, // down
                    l: false, // left
                    r: false, //right
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
            self.dbg = performance.now();
            worker('analyze', {
                maze: this.maze,
                starts: confVillage.starts,
                ends: confVillage.ends,
            }).then(this.analyze.bind(this));
            this.$emit('maze_change');
        },
    },
});

export default Village;
