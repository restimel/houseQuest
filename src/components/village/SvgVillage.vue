<template>
<svg width="95%" height="95%" :viewBox="[-size, -size, svgWidth, svgHeight].join(' ')">
    <defs>
        <path id="arrow" d="M0,35 v-60 l-20,20 20,-20 20,20" />
    </defs>
    <g>
        <rect
            class="villageWall"
            x="0"
            y="0"
            :width="width"
            :height="height"
        />

        <g v-for="start of starts" :key="'start-'+start">
            <rect
                class="villageStart"
                :x="cellX(start)"
                :y="cellY(start)"
                :width="size"
                :height="size"
            />
            <use href="#arrow"
                x="0"
                y="0"
                :transform="transformArrow(start)"
            />
        </g>
        <g v-for="end of ends" :key="'end-'+end">
            <rect
                class="villageEnd"
                :x="cellX(end)"
                :y="cellY(end)"
                :width="size"
                :height="size"
            />
            <use href="#arrow"
                x="0"
                y="0"
                :transform="transformArrow(end, true)"
            />
        </g>
    </g>
</svg>
</template>

<script>
import Village from '@/models/village';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

export default {
    name: 'VillageView',
    props: {
        village: {
            type: Village,
        },
    },
    data: function() {
        return {
            size: 100,
            starts: confVillage.starts,
            ends: confVillage.ends,
        };
    },
    computed: {
        sizeX: function() {
            return this.village.maze.length;
        },
        sizeY: function() {
            return (this.village.maze[0] || []).length;
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
        transformArrow: function(cell, opposite) {
            const [x, y] = cell.split(/,\s*/).map(a => (+a + 0.5) * this.size);
            let deg = 0;
            if (x < 0) {
                deg = 90;
            } else
            if (y < 0) {
                deg = 180;
            } else
            if (x >= this.width) {
                deg = -90;
            }

            if (opposite) {
                deg += 180;
            }
            return `translate(${x}, ${y}) rotate(${deg})`;
        }
    },
};
</script>

<style scoped>
    .villageWall {
        fill: rgb(250, 235, 190);
        stroke: rgb(150, 150, 150);
        stroke-width: 2px;
    }

    .villageStart {
        fill: rgb(150, 250, 150);
        stroke: rgb(0, 150, 0);
        stroke-width: 1px;
    }

    .villageEnd {
        fill: rgb(250, 150, 150);
        stroke: rgb(250, 0, 0);
        stroke-width: 1px;
    }

    #arrow {
        fill: none;
        stroke: white;
        stroke-width: 10px;
    }
</style>
