import Vue from 'vue';
import store from '@/core/indexedDB';
import conf from '@/models/configurations';

import configuration from '@/configuration';
const { house: confHouse } = configuration;

const House = Vue.component('House', {
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
            updateDate: 0,
            createDate: 0,
            orientation: 'UP',
            sizeX: confHouse.sizeX,
            sizeY: confHouse.sizeY,
            conf: conf,
        };
    },
    methods: {
        initMaze: function(withoutBorder = false) {
            const maze = new Array(confHouse.sizeX);
            for (let x = 0; x < confHouse.sizeX; x++) {
                const column = new Array(confHouse.sizeY);
                for (let y = 0; y < confHouse.sizeY; y++) {
                    column[y] = {
                        u: withoutBorder || y > 0,
                        d: withoutBorder || y < confHouse.sizeY - 1,
                        l: withoutBorder || x > 0,
                        r: withoutBorder || x < confHouse.sizeX -1,
                        b: false,
                        t: false,
                    };
                }
                maze[x] = column;
            }
            this.maze = maze;
        },
        get: async function(name, asDefault = false) {
            if (asDefault) {
                await this.conf.isLoaded;
                if (this.conf.houseName) {
                    name = this.conf.houseName;
                }
            }
            if (name === '_empty_') {
                this.name = '';
                this.initMaze(true);
                return this;
            }
            let house = await store.house.get(name);
            if (!house) {
                house = {
                    name: name,
                    maze: [],
                    updateDate: 0,
                    createDate: 0,
                    size: `${confHouse.sizeX}×${confHouse.sizeY}`,
                }
            }

            this.name = house.name;
            this.maze = house.maze;
            this.updateDate = house.updateDate;
            this.createDate = house.createDate;
            if (house.size) {
                const sizes = house.size.split('×');
                this.sizeX = +sizes[0];
                this.sizeY = +sizes[1];
            } else {
                this.sizeX = house.maze.length;
                this.sizeY = this.sizeX && house.maze[0].length;
            }

            if (!asDefault) {
                this.sync();
            }

            return this;
        },
        save: function() {
            const p = store.house.set({
                name: this.name || 'house1',
                maze: this.maze,
                updateDate: this.updateDate,
                createDate: this.createDate,
                size: `${this.sizeX}×${this.sizeY}`,
            });

            p.then(() => this.sync());
            return p;
        },
        delete: async function() {
            await store.village.delete(this.name);

            this.name = '';
            this.maze = [];
            this.sync();
        },
        sync: function () {
            if (this.synchronized && this.name && this.name !== '_empty_') {
                this.conf.houseName = this.name;
            }
        },
        getCell: function(x, y) {
            const [X, Y] = this._orientationXY(x, y);
            const maze = this.maze;
            const column = maze[X];
            if (column && column[Y]) {
                return this._orientationCell(column[Y]);
            }

            return {
                // false → a wall, true → possibility to move this way
                u: false, // up
                d: false, // down
                l: false, // left
                r: false, //right
                b: false, //bottom
                t: false, //top
            };
        },
        setCell: function(x, y, value = {}) {
            const [X, Y] = this._orientationXY(x, y);
            const maze = this.maze;
            const column = maze[x];
            if (column && column[y]) {
                Object.assign(column[y], this._orientationCell(value, '-' + this.orientation));
            }
        },
        _orientationXY: function (x, y, orientation = this.orientation) {
            switch(orientation) {
                case 'DOWN':
                    return [this.sizeX - x - 1, this.sizeY - y - 1];
                case 'LEFT':
                    return [this.sizeX - y - 1, x];
                case 'RIGHT':
                    return [y, this.sizeY - x - 1];
                case 'UP':
                default:
                    return [x, y];
            }
        },
        _orientationCell: function(cell, orientation = this.orientation) {
            let u, d, l, r;

            switch(orientation) {
                case 'DOWN':
                case '-DOWN':
                    u = 'd';
                    d = 'u';
                    l = 'r';
                    r = 'l';
                    break;
                case 'LEFT':
                case '-RIGHT':
                    u = 'r';
                    d = 'l';
                    l = 'u';
                    r = 'd';
                    break;
                case 'RIGHT':
                case '-LEFT':
                    u = 'l';
                    d = 'r';
                    l = 'd';
                    r = 'u';
                    break;
                case 'UP':
                case '-UP':
                default:
                    return cell;
            }

            return {
                u: cell[u],
                d: cell[d],
                l: cell[l],
                r: cell[r],
                b: cell.b,
                t: cell.t,
            };
        },
    },
});

export default House;
