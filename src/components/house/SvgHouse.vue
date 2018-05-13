<template>
<svg width="80%" height="80%" :viewBox="[-size, -size, svgWidth, svgHeight].join(' ')">
    <defs>
        <path id="wallLeft" d="M0,0 v100" />
        <path id="wallUp" d="M0,0 h100" />
        <path id="wallRight" d="M100,0 v100" />
        <path id="wallDown" d="M0,100 h100" />
    </defs>
    <g>
        <rect
            class="house"
            x="0"
            y="0"
            :width="width"
            :height="height"
        />
    </g>
    <template v-if="house.maze[0]">
        <g v-for="(cellColumn, idx) of house.maze"
            :key="'cellColumn-'+idx"
        >
            <g v-for="(cell, idy) of cellColumn"
                :key="'cell-'+idx+'-'+idy"
            >
                <use :x="idx * size" :y="idy * size" href="#wallLeft" class="wall" :class="{isSolidWall: !cell.l}" @click="changeWall(idx, idy, 'l')" />
                <use :x="idx * size" :y="idy * size" href="#wallRight" class="wall" :class="{isSolidWall: !cell.r}" @click="changeWall(idx, idy, 'r')" />
                <use :x="idx * size" :y="idy * size" href="#wallUp" class="wall" :class="{isSolidWall: !cell.u}" @click="changeWall(idx, idy, 'u')" />
                <use :x="idx * size" :y="idy * size" href="#wallDown" class="wall" :class="{isSolidWall: !cell.d}" @click="changeWall(idx, idy, 'd')" />
            </g>
        </g>
    </template>
</svg>
</template>

<script>
import House from '@/models/house';

import configuration from '@/configuration';
const {house: confHouse} = configuration;

export default {
    name: 'HouseView',
    props: {
        house: {
            type: House,
        },
    },
    data: function() {
        return {
            size: 100,
        };
    },
    computed: {
        sizeX: function() {
            return this.house.maze.length;
        },
        sizeY: function() {
            return (this.house.maze[0] || []).length;
        },
        width: function() {
            return this.sizeX * this.size;
        },
        height: function() {
            return this.sizeY * this.size;
        },
        svgWidth: function() {
            return this.width + 2 * this.size;
        },
        svgHeight: function() {
            return this.height + 2 * this.size;
        },
    },
    methods: {
        cellX: function(cell) {
            return cell.split(/,\s*/)[0] * this.size;
        },
        cellY: function(cell) {
            return cell.split(/,\s*/)[1] * this.size;
        },
        changeWall: function(x, y, side) {
            const cell1 = this.house.maze[x][y];
            const value = !cell1[side];
            
            cell1[side] = value;
            switch(side) {
                case 'l':
                    this.house.setCell(x-1, y, {r: value});
                    break;
                case 'r':
                    this.house.setCell(x+1, y, {l: value});
                    break;
                case 'u':
                    this.house.setCell(x, y-1, {d: value});
                    break;
                case 'd':
                    this.house.setCell(x, y+1, {u: value});
                    break;
            }
        }
    },
};
</script>

<style scoped>
    .house {
        fill: var(--house-background);
        stroke: var(--house-border);
        stroke-width: 2px;
    }

    .wall {
        fill: none;
        stroke: rgba(0, 0, 0, 0);
        stroke-width: 15;
        stroke-linecap: square;
        cursor: pointer;
    }
    .wall:hover {
        stroke: var(--house-no-wall-hover);
    }

    .isSolidWall {
        stroke: var(--house-wall);
    }
    .isSolidWall:hover {
        stroke: var(--house-wall-hover);
    }
</style>
