<template>
<div class="svg-container">
    <div>
        <span v-if="canChangeDetail"
            class="interactive-area switch-display"
            @click="switchDisplay('info')"
        >
            <Icon :icon="['fas', isDetailed ? 'eye' : 'eye-slash']" />
            House name
        </span>
        <span v-if="canChangePath"
            class="interactive-area switch-display"
            @click="switchDisplay('path')"
        >
            <Icon :icon="['fas', whichPath === 0 ? 'eye-slash' : whichPath === 1 ? 'low-vision' : 'eye']" />
            {{pathDisplaySummary[whichPath]}}
        </span>
        <span v-if="canChangeLimitation"
            class="interactive-area switch-display"
            @click="switchDisplay('limitation')"
        >
            <Icon :icon="['fas', isLimitation ? 'eye' : 'eye-slash']" />
            {{currentDisplay.limitation ? 'houe limitation' : 'house cells'}}
        </span>
    </div>
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

            <!-- start cells -->
            <g v-for="start of starts" :key="'start-'+start"
                @click="toggleOutsideCell(start)"
                class="{'interactive-area': !readonly}"
            >
                <rect
                    class="villageStart"
                    :class="{cellDisabled: village.disablingOutsideCells.includes(start)}"
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
            <!-- end cells -->
            <g v-for="end of ends" :key="'end-'+end"
                @click="toggleOutsideCell(end)"
                class="interactive-area"
            >
                <rect
                    class="villageEnd"
                    :class="{cellDisabled: village.disablingOutsideCells.includes(end)}"
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

            <!-- maze cells -->
            <template v-if="isMaze">
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

            <!-- path arrows -->
            <template v-if="arrowCells">
                <g v-for="(cellColumn, idx) of arrowCells"
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

            <!-- information about houses and orientation limitation -->
            <template v-if="isLimitation">
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
                            {{getOrientationInfo(idx)}}
                        </tspan>
                    </text>
                </g>
            </template>

            <!-- info (detail) of this house -->
            <template v-if="isDetailed">
                <g v-for="(cellHouse, idx) of village.houses"
                    :key="'villageHouseDetail-'+idx"
                >
                    <title>{{getHouseDetail(idx)}}</title>
                    <rect
                        class="houseDetailArea"
                        :x="(getHouseX(idx) + 0.5) * houseWidth"
                        :y="getHouseY(idx) * houseHeight"
                        :width="houseWidth / 2"
                        :height="55"
                    />
                    <text
                        class="text-detail"
                    >
                        <tspan
                            :x="(getHouseX(idx) + 0.75) * houseWidth"
                            :y="getHouseY(idx) * houseHeight + 40"
                        >
                            {{getHouseDetail(idx)}}
                        </tspan>
                    </text>
                </g>
            </template>

            <!-- selectable area -->
            <template v-if="!readonly">
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
</div>
</template>

<script>
import Village from '@/models/village';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

const arrows = {
    'UP': '↑',
    'DOWN': '↓',
    'LEFT': '←',
    'RIGHT': '→',
};

const noParentCell = {
    dirParent: '',
    dist: Infinity,
    orientation: '',
    parent: NaN,
};

export default {
    name: 'VillageView',
    props: {
        village: {
            type: Village,
        },
        readonly: {
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
            type: Object,
            default: function() {
                return {
                    limitation: false, // display limitation instead of maze
                    info: true, // display name and orientation
                    path: 2, // 0: no display; 1: display: shortest path; 2: display all
                };
            },
        },
        changeDisplay: {
            type: [Boolean, Object],
            default: true,
        },
    },
    data: function() {
        this.pathDisplaySummary = [
            'No path',
            'Only shortest path',
            'All accessible cells',
        ];

        return {
            size: 100,
            starts: confVillage.starts,
            ends: confVillage.ends,
            renderId: 0,
            currentDisplay: Object.assign({}, this.display),
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
        isMaze: function() {
            return !this.isLimitation && this.village.maze[0];
        },
        isLimitation: function() {
            return !!this.currentDisplay.limitation;
        },
        isDetailed: function() {
            return !!this.currentDisplay.info;
        },
        whichPath: function() {
            return this.currentDisplay.path;
        },
        arrowCells: function() {
            const pathDisplay = this.whichPath;
            const result = this.result;
            const cells = result.cells;

            if (!cells) {
                return;
            }

            if (pathDisplay === 0) {
                return;
            }
            if (pathDisplay === 1) {
                return cells.map((rows, x) => rows.map((cell, y) => {
                    if (result.shortestPath.has(`${x}, ${y}`)) {
                        return cell;
                    }
                    return noParentCell;
                }));
            }
            return cells;
        },
        canChangeLimitation: function() {
            const changeDisplay = this.changeDisplay;
            if (typeof changeDisplay === 'boolean') {
                return changeDisplay;
            }
            return !!changeDisplay.limitation;
        },
        canChangeDetail: function() {
            const changeDisplay = this.changeDisplay;
            if (typeof changeDisplay === 'boolean') {
                return changeDisplay;
            }
            return !!changeDisplay.info;
        },
        canChangePath: function() {
            const changeDisplay = this.changeDisplay;
            if (typeof changeDisplay === 'boolean') {
                return changeDisplay;
            }
            return !!changeDisplay.path;
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
        getOrientationInfo: function(idx) {
            const info = this.village.infos[idx] || {};
            let text;
            if (!info.orientations || !info.orientations.length) {
                text = 'Default orientations';
            } else {
                text = info.orientations.map(o => arrows[o]).join(' ');
            }
            return text;
        },
        getHouseDetail: function(idx) {
            const [name, orientation] = this.village.houses[idx].split('§');
            return `${name} ${arrows[orientation]}`;
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
        toggleOutsideCell: function(cell) {
            if (!this.readonly) {
                this.village.toggleOutsideCell(cell);
            }
        },
        switchDisplay: function(attribute) {
            let value = this.currentDisplay[attribute];

            if (attribute === 'path') {
                value = (value + 2) % 3;
            } else {
                value = !value;
            }
            this.currentDisplay[attribute] = value;
        },
    },
    watch: {
        display: function() {
            this.currentDisplay = Object.assign({}, this.display);
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

    .cellDisabled {
        fill: var(--cell-background-disabled);
        stroke: var(--cell-border-disabled);
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
    .text-detail {
        font-size: 50px;
        text-anchor: middle;
    }
    .houseDetailArea {
        fill: var(--selected-item-background);
        opacity: 0.5;
    }
    .button {
        font-size: 50px;
        text-anchor: middle;
        cursor: pointer;
    }
    .item-display {
        font-size: 50px;
        text-anchor: end;
        cursor: pointer;
    }
    .button rect {
        fill: #e3e3e3;
        stroke-width: 2px;
        stroke: black;
    }
    .switch-display {
        margin-right: 1em;
    }
</style>
