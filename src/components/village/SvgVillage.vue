<template>
<svg width="95%" height="95%" :viewBox="[-size, -size, svgWidth, svgHeight].join(' ')">
    <defs>
        <path id="arrow" d="M0,35 v-60 l-20,20 20,-20 20,20" />
        <path id="wallLeft" d="M0,0 v100" />
        <path id="wallUp" d="M0,0 h100" />
        <path id="wallRight" d="M100,0 v100" />
        <path id="wallDown" d="M0,100 h100" />
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

        <template v-if="village.maze[0]">
            <g v-for="(cellColumn, idx) of village.maze"
                :key="'villageCellColumn-'+idx"
            >
                <g v-for="(cell, idy) of cellColumn"
                    :key="'villageCell-'+idx+'-'+idy"
                >
                    <use :x="idx * size" :y="idy * size" href="#wallLeft" class="wall" :class="{isSolidWall: !cell.l}" :rid="renderId" />
                    <use :x="idx * size" :y="idy * size" href="#wallRight" class="wall" :class="{isSolidWall: !cell.r}" :rid="renderId" />
                    <use :x="idx * size" :y="idy * size" href="#wallUp" class="wall" :class="{isSolidWall: !cell.u}" :rid="renderId" />
                    <use :x="idx * size" :y="idy * size" href="#wallDown" class="wall" :class="{isSolidWall: !cell.d}" :rid="renderId" />
                </g>
            </g>
        </template>

        <template v-if="!readOnly">
            <rect v-for="(cellHouse, idx) of village.houses"
                :key="'villageHouse-'+idx"
                class="houseArea"
                :class="{selectedHouse: selected.idx === idx}"
                :x="getHouseX(idx) * houseWidth"
                :y="getHouseY(idx) * houseHeight"
                :width="houseWidth"
                :height="houseHeight"
                @click="selectHouse(cellHouse, idx)"
            />
        </template>
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
        readOnly: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Object,
            default: function() {
                return {};
            },
        },
    },
    data: function() {
        return {
            size: 100,
            starts: confVillage.starts,
            ends: confVillage.ends,
            renderId: 0,
        };
    },
    created: function() {
        this.village.$on('maze_change', () => {
            this.renderId++;
        });
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
        houseWidth: function() {
            return confHouse.sizeX * this.size
        },
        houseHeight: function() {
            return confHouse.sizeY * this.size
        },
    },
    methods: {
        cellX: function(cell) {
            return cell.split(/,\s*/)[0] * this.size;
        },
        cellY: function(cell) {
            return cell.split(/,\s*/)[1] * this.size;
        },
        getHouseX: function(idx) {
            return Math.floor(idx / confVillage.sizeX);
        },
        getHouseY: function(idx) {
            return idx % confVillage.sizeX;
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
        },
        selectHouse: function(house, idx) {
            this.$emit('selection', house, idx);
        },
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

    .wall {
        fill: none;
        stroke: rgba(250, 235, 190, 0);
        stroke-width: 15;
        stroke-linecap: square;
    }
    .isSolidWall {
        stroke: rgb(50, 0, 50);
    }

    .houseArea {
        fill: rgba(0, 0, 0, 0);
        stroke: none;
        cursor: pointer;
    }
    .houseArea:hover {
        fill: rgba(250, 230, 0, 0.3);
        stroke: rgba(250, 230, 0, 0.7);
        stroke-width: 5;
        stroke-dasharray: 15;
    }
    .selectedHouse {
        fill: rgba(250, 230, 0, 0.2);
        stroke: rgba(250, 230, 0, 0.8);
        stroke-width: 5;
        stroke-dasharray: 15;
    }
</style>
