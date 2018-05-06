import Vue from 'vue';
import store from '@/core/indexedDB';

import configuration from '@/configuration';
const { house: confHouse } = configuration;

const House = Vue.component('House', {
    data: function() {
        return {
            name: '',
            maze: [],
            houses: [],
            updateDate: 0,
            createDate: 0,
        };
    },
    methods: {
        get: async function(name) {
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
            
            return this;
        },
        save: function() {
            return store.house.set({
                name: this.name,
                maze: this.maze,
                updateDate: this.updateDate,
                createDate: this.createDate,
            });
        },
        getCell: function(x, y) {
            const maze = this.maze;
            const column = maze[x];
            if (column && column[y]) {
                return column[y];
            }

            return {
                u: false, // up
                d: false, // down
                l: false, // left
                r: false, //right
            };
        },
    },
});

export default House;
