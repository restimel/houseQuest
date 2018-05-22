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
                }
            }
            this.name = house.name;
            this.maze = house.maze;
            this.updateDate = house.updateDate;
            this.createDate = house.createDate;

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
                u: false, // up
                d: false, // down
                l: false, // left
                r: false, //right
            };
        },
        setCell: function(x, y, value = {}) {
            const [X, Y] = this._orientationXY(x, y);
            const maze = this.maze;
            const column = maze[x];
            if (column && column[y]) {
                Object.assign(column[y], this._orientationCell(value), '-' + this.orientation);
            }
        },
        _orientationXY: function (x, y, orientation = this.orientation) {
            switch(orientation) {
                case 'DOWN':
                    return [confHouse.sizeX - x - 1, confHouse.sizeY - y - 1];
                case 'LEFT':
                    return [confHouse.sizeX - y - 1, x];
                case 'RIGHT':
                    return [y, confHouse.sizeY - x - 1];
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
            };
        },
    },
});

export default House;
