import Vue from 'vue';
import store from '@/core/indexedDB';
import House from '@/models/house';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

const Village = Vue.component('Village', {
    data: function() {
        return {
            name: '',
            maze: [],
            houses: [],
            houseModels: [],
            updateDate: 0,
            createDate: 0,
        };
    },
    methods: {
        get: async function(name) {
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
        },
        save: function() {
            return store.village.set({
                name: this.name,
                maze: this.maze,
                houses: this.houseModels.map(houseX => houseX.map(house => house.name + '§' + house.orientation)),
                updateDate: this.updateDate,
                createDate: this.createDate,
            });
        },
        _initMaze: function() {
            const xLength = confVillage.sizeX * confHouse.sizeX;
            const yLength = confVillage.sizeY * confHouse.sizeY;

            const maze = new Array(xLength);
            for (let x = 0; x < xLength; x++) {
                maze[x] = new Array(yLength);
            }

            this.maze = maze;
        },
    },
    watch: {
        houses: async function() {
            const houses = this.houses;
            const houseMaze = new Array(confVillage.sizeX);
            const promises = [];

            this._initMaze();

            for (let x = 0; x < confVillage.sizeX; x++) {
                houseMaze[x] = new Array(confVillage.sizeY);
                for (let y = 0; y < confVillage.sizeY; y++) {
                    const house = new House();
                    houseMaze[x][y] = house;
                    const [houseName, orientation] = (houses[x] && houses[x][y] || '').split('§')[0];
                    house.orientation = orientation;
                    promises.push(house.get(houseName));
                }
            }

            this.houseModels = houseMaze;
            await Promise.all(promises);
            const xLength = confVillage.sizeX * confHouse.sizeX;
            const yLength = confVillage.sizeY * confHouse.sizeY;

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
                }
            }
        },
    },
});

export default Village;
