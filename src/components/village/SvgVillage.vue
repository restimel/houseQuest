<template>
<svg width="98%" height="98%" :viewBox="[-size, -size, svgWidth, svgHeight].join(' ')">
    <defs>
        <path id="arrow" class="arrow" d="M0,25 v-55 l-20,20 20,-20 20,20" />
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
                class="outside"
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
                class="outside"
                x="0"
                y="0"
                :transform="transformArrow(end, true)"
            />
        </g>

        <template v-if="display==='maze' && village.maze[0]">
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

        <template v-if="display==='info'">
            <g v-for="(cellHouse, idx) of village.houses"
                :key="'villageHouseInfo-'+idx"
            >
                <rect
                    class="houseInfoArea"
                    :x="getHouseX(idx) * houseWidth"
                    :y="getHouseY(idx) * houseHeight"
                    :width="houseWidth"
                    :height="houseHeight"
                />
                <text
                    class="text-info"
                >
                    <tspan
                        :x="(getHouseX(idx) + 0.5) * houseWidth"
                        :y="(getHouseY(idx) + 0.45) * houseHeight"
                    >
                        {{getHouseInfo(idx)}}
                    </tspan>
                    <tspan
                        :x="(getHouseX(idx) + 0.5) * houseWidth"
                        :y="(getHouseY(idx) + 0.45) * houseHeight + 50"
                    >
                        {{getDirectionInfo(idx)}}
                    </tspan>
                </text>
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

        <template v-if="result.cells">
            <g v-for="(cellColumn, idx) of result.cells"
                :key="'resultCellColumn-'+idx"
            >
                <g v-for="(cell, idy) of cellColumn"
                    :key="'resultCell-'+idx+'-'+idy"
                >
                    <use href="#arrow"
                        v-if="cell.orientation"
                        :class="result.shortestPath.has(idx+', '+idy) ? 'solution' : 'notSolution'"
                        x="0"
                        y="0"
                        :transform="transformXYArrow(idx, idy, cell.orientation)"
                    />
                </g>
            </g>
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
        result: {
            type: Object,
            default: function() {
                return {};
            },
        },
        display: {
            type: String,
            default: 'maze',
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
            return confHouse.sizeX * this.size;
        },
        houseHeight: function() {
            return confHouse.sizeY * this.size;
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
        getHouseInfo: function(idx) {
            const info = this.village.infos[idx] || {};
            let text;
            if (!info.houses || !info.houses.length) {
                text = 'Default selection';
            } else
            if (info.houses.length === 1) {
                text = `"${info.houses[0]}" only`;
            } else {
                text = `limited to ${info.houses.length} houses`;
            }
            return text;
        },
        getDirectionInfo: function(idx) {
            const info = this.village.infos[idx] || {};
            let text;
            if (!info.directions || !info.directions.length) {
                text = 'Default orientations';
            } else {
                text = info.directions.join(' ');
            }
            return text;
        },
        transformXYArrow: function(x, y, orientation) {
            let deg = 0;
            switch (orientation) {
                case 'r': case '-l': deg = 90; break
                case 'l': case '-r': deg = -90; break
                case 'd': case '-u': deg = 180; break
                case 'u': case '-d': deg = 0; break
            }
            x = (x + 0.5) * this.size;
            y = (y + 0.5) * this.size;
            return `translate(${x}, ${y}) rotate(${deg})`;
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
        fill: var(--village-background);
        stroke: var(--village-border);
        stroke-width: 2px;
    }

    .villageStart {
        fill: var(--start-background);
        stroke: var(--start-border);
        stroke-width: 1px;
    }

    .villageEnd {
        fill: var(--end-background);
        stroke: var(--end-border);
        stroke-width: 1px;
    }

    .arrow {
        fill: none;
        stroke-width: 10px;
        stroke-linecap: round;
        stroke-linejoin:round;
    }
    .solution {
        stroke: var(--arrow-solution);
    }
    .notSolution {
        stroke: var(--arrow-not-solution);
    }
    .outside {
        stroke: var(--arrow-outside);
    }

    .wall {
        fill: none;
        stroke: rgba(0, 0, 0, 0);
        stroke-width: 15;
        stroke-linecap: square;
    }
    .isSolidWall {
        stroke: var(--house-wall);
    }

    .houseInfoArea {
        fill: none;
        stroke: var(--house-wall);
    }

    .houseArea {
        fill: rgba(0, 0, 0, 0);
        stroke: none;
        cursor: pointer;
    }
    .houseArea:hover {
        fill: var(--house-area-hover-background);
        stroke: var(--house-area-hover-border);
        stroke-width: 5;
        stroke-dasharray: 15;
    }
    .selectedHouse {
        fill: var(--house-selected-background);
        stroke: var(--house-selected-border);
        stroke-width: 5;
        stroke-dasharray: 15;
    }
    .text-info {
        font-size: 30px;
        text-anchor: middle;
    }
</style>
