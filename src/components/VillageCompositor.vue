<template>
<div class="composition"
    :class="{
        dragover: dragover,
    }"
    dropzone="copy f:image/png"
    @dragover.prevent.stop="dragover=true"
    @dragenter="dragover=true"
>
    <div class="dragmask"
        v-show="dragover"

        @drop.prevent="dropFile"
        @dragover.prevent="()=>{}"
        @dragleave="dragover=false"
    >
    </div>
    <DetailsCustom
        class="request details"
        :open="isRequestOpen"
        @change="changedStateRequest"
    >
        <div
            class="summary"
            slot="summary"
        >
            <header>
                <h2>Request</h2>
            </header>
            <div class="info-progress">
                <template v-if="computeProgress >= 0">
                    <progress min="0" max="1"
                        :value="computeProgress"
                        :title="stateProgress"
                    />
                    <span
                        :title="stateProgress"
                    >{{Math.round(computeProgress * 1000)/10}}%</span>
                </template>
            </div>
        </div>
        <section
            class="sharedArea"
            slot="body"
        >
            <div class="filter">
                <label title="Keep only result which are in the corresponding range">
                    Difficulty range:
                    <VueSlider
                        class="slider"
                        :min="0"
                        :max="100"
                        width="250px"
                        formatter="{value}%"
                        v-model="filter.difficulty"
                        @input="resetOffset"
                    />
                </label>
                <br>
                <label title="Regroup result which are similar. This is the threshold of similarty.">
                    Group similar results:
                    <VueSlider
                        class="slider"
                        :min="0"
                        :max="100"
                        width="250px"
                        formatter="{value}%"
                        v-model="conf.groupThreshold"
                    />
                </label>
            </div>
            <Village
                class="svg"
                :village="village"
                :selected="selectedHouse"
                :display="{
                    limitation: true,
                }"
                :changeDisplay="false"
                @selection="selectHouse"
            />
            <HouseSelector
                class="action"
                :selected="selectedHouse"
                :list="houseList"
                @change="changeHouse"
            />
            <RequestStatus
                class="option"
                :village="village"
                :list="houseList"
                @nbPossibilities="changeNbPossibilities"
            />
        </section>
    </DetailsCustom>

    <DetailsCustom
        class="result details"
        :open="isResultOpen"
        @change="changedStateResult"
    >
        <div
            slot="summary"
            class="summary"
        >
            <header>
                <h2>
                    <Icon v-if="selectedGroup !== -1 && villageComputed.length > groupList.length"
                        icon="arrow-alt-circle-left"
                        class="interactive-area"
                        title="See all results"
                        @click.stop="selectGroup(-1)"
                    />
                    Result
                    <span v-if="villageComputed.length > 0">({{villageComputed.length}})</span>
                    <Icon v-show="villageComputedDisplayed.length > 0"
                        icon="trash-alt"
                        class="interactive-area"
                        title="Clear all results"
                        @click.stop="showRemoveResult = true"
                    />
                </h2>
            </header>
            <div class="controls-compute">
                <button v-if="!isRuning"
                    :disabled="!canCompute"
                    :title="statusCompute"
                    @click.stop.prevent="compute"
                >
                    <Icon icon="calculator"/>
                    Compute <span v-show="continueComputation">(continue)</span>
                </button>
                <button v-else
                    :disabled="isStopping"
                    @click.stop.prevent="stopCompute"
                >
                    <span v-if="!isStopping">Stop</span>
                    <span v-else>Stopping...</span>
                </button>
                <progress v-show="isRuning"/>
                <span v-show="isRuning" title="Average speed of computation (in number of position computed per second)">{{ this.speed | units }}</span>
            </div>
        </div>
        <div slot="body" class="sharedArea resultArea">
            <div class="village-result">
                <span v-show="villageComputedDisplayed.length === 0"
                    class="noResult"
                >
                    No results found yet :/
                </span>
                <VillageResult v-for="(vResult, idx) of villageComputedDisplayed"
                    :key="'villageResult' + vResult.houseId + '-' + vResult.groupList.length"
                    class="village-result-item"
                    :class="{'result-selected': selectedResult.houseId === vResult.houseId}"
                    :result="vResult"
                    :isGroupedResult="selectedGroup !== -1"
                    summary="true"
                    @click="selectResult(vResult.houseId)"
                    @expandGroup="selectGroup(idx)"
                />
                <div
                    v-show="nbMoreResult > 0"
                    class="village-result-item interactive-area"
                    @click="paginateResult"
                >
                    There are also {{nbMoreResult}} more result.
                </div>
            </div>
            <VillageResultDetails
                class="result-details"
                :result="selectedResult"
                ref="villageReesultDetails"
            />
            <div class="controls">
                <button
                    :disabled="villageComputed.length === 0"
                    title="Export results to a CSV file"
                    @click="showExport=true"
                >
                    <Icon icon="file-import" />
                    Export
                </button>
                <button
                    title="Import results from a CSV file"
                    @click="showImport=true"
                >
                    <Icon icon="file-export" />
                    Import
                </button>
                <button
                    v-show="!!selectedResult.houseId"
                    title="Remove this result from list of results"
                    @click="removeResult"
                >
                    <Icon icon="trash-alt" />
                    Remove
                </button>
                <button
                    v-show="!!selectedResult.houseId"
                    :title="`Save this result as a &quot;${villageName}&quot;`"
                    @click="save"
                >
                    <Icon icon="save" />
                    Save
                </button>
            </div>
        </div>
    </DetailsCustom>

    <AskDialog
        title="Clear all results"
        saveButton="Clear"
        :show="showRemoveResult"
        @close="showRemoveResult=false"
        @confirm="clearResult"
    >
        <span>All results will be lost. Are you sure to continue?</span>
    </AskDialog>
    <ExportVillages
        :show="showExport"
        :list="villageComputed"
        @close="showExport=false"
    />
    <ImportVillages
        :show="showImport"
        :dragFiles="dragFiles"
        @import="importResults"
        @close="showImport=false"
    />
</div>
</template>

<script>
import Vue from 'vue';
import conf from '@/models/configurations';
import store from '@/core/indexedDB';
import Village from '@/models/village';
import Details from '@/components/Details';
import HouseSelector from '@/components/composition/HouseSelector';
import RequestStatus from '@/components/composition/RequestStatus';
import VillageResult from '@/components/composition/VillageResult';
import VillageResultDetails from '@/components/composition/VillageResultDetails';
import VillageView from '@/components/village/SvgVillage';
import ExportVillages from '@/components/village/ExportVillages';
import ImportVillages from '@/components/village/ImportVillages';
import AskDialog from '@/components/AskDialog';
import worker from '@/core/worker';
import VueSlider from 'vue-slider-component';
import levenshtein from 'fast-levenshtein';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

const configurationHeight = confVillage.sizeX * confHouse.sizeX;

const emptyCell = {
    u: true,
    d: true,
    l: true,
    r: true,
    b: true,
    t: true,
};
const HOUSE_EMPTY_NAME = '_empty_';
const HOUSE_EMPTY_ID = '_empty_';
const HOUSE_EMPTY = {
    name: HOUSE_EMPTY_ID,
    maze: [
        [emptyCell, emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell, emptyCell],
        [emptyCell, emptyCell, emptyCell, emptyCell],
    ],
};

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh();

        const village = new Village({
            propsData: {
                withoutAnalyze: true,
                forceAnalyze: false,
            },
        });

        this.getFromStore();

        this.villageComputedShowList = []; // used to keep a unique reference and avoid useless rerendering.
        this.groupListOldValue = []; // used to restore value when there is no change (and avoid rerendering)

        this.storeDistance = new Map();
        this.villageComputedNb = 0;

        return {
            conf: conf,
            isRequestOpen: true,
            isResultOpen: false,
            village: village,
            houseList: [],
            selectedHouse: {
                info: village.defaultInfo,
            },
            nbPossibilities: 0,
            computeProgress: -1,
            isRuning: false,
            isStopping: false,
            offset: 0,
            villageComputed: [],
            startCompute: -1,
            status: 'not started',
            showRemoveResult: false,
            resultLimitation: conf.resultLimitation,
            resultDisplayLimitation: 10,
            showExport: false,
            showImport: false,
            filter: {
                difficulty: [0, 100],
                weight: {},
            },
            dragFiles: null,
            dragover: false,

            selectedResult: {},
            selectedGroup: -1,

            villageName: configuration.cubeName,
        };
    },
    computed: {
        canCompute: function() {
            return this.nbPossibilities > this.offset && this.village.listStart.length && this.village.listEnd.length;
        },
        statusCompute: function() {
            let text = '';
            if (this.nbPossibilities <= this.offset) {
                text = 'All possibilities are already computed';
            } else
            if (!this.village.listStart.length || !this.village.listEnd.length) {
                text = 'There is no possibility to find solvable configuration';
            }
            return text;
        },
        speed: function() {
            const offset = this.offset;
            const startCompute = this.startCompute;
            if (offset) {
                const speed = offset / ((performance.now() - startCompute) * 1000); // in M per second
                return speed;
            } else {
                return 0;
            }
        },
        stateProgress: function() {
            return `${this.status} ${this.offset} / ${this.nbPossibilities}`;
        },
        continueComputation: function() {
            return this.canCompute && this.offset > 0;
        },
        groupList: function() {
            const showList = this.villageComputed;
            const groupThreshold = this.conf.groupThreshold;

            const groupList = showList.reduce((list, result) => {
                const leaderResult = list.find((r) => this.looksLike(r, result) > groupThreshold);

                if (leaderResult) {
                    leaderResult.groupList.push(result);
                } else {
                    result.groupList = [result];
                    list.push(result);
                }
                return list;
            }, []);

            // check if there are any change from previous result
            const idNew = groupList.map(r => r.groupList.length).join('');
            const idOld = this.groupListOldValue.map(r => r.groupList.length).join('');

            if (idNew === idOld) {
                return this.groupListOldValue;
            }

            this.updateGroupList(groupList);

            return groupList;
        },
        selectedGroupList: function() {
            const selectedGroup = this.selectedGroup;
            return selectedGroup === -1 ? this.groupList : this.groupList[selectedGroup].groupList;
        },
        villageComputedDisplayed: function() {
            const showList = this.villageComputedShowList;
            const showLng = showList.length;
            const villageComputed = this.selectedGroupList;

            const computedLng = villageComputed.length;
            const limitation = this.resultDisplayLimitation;
            if (showLng < limitation && computedLng > showLng) {
                const items = villageComputed.slice(showLng, limitation);
                showList.push(...items);
            }

            return showList;
        },
        nbMoreResult: function() {
            return this.selectedGroupList.length - this.villageComputedDisplayed.length;
        },
        watcherInfo: function() {
            return (this.conf.infos, this.conf.defaultInfo, Date.now());
        },
    },
    created: function() {
        this.updateInfo();
    },
    methods: {
        getFromStore: async function() {
            let data = await store.configuration.get('weight');
            if (!data) {
                data = await store.configuration.get('defaultWeight') || {};
            }
            this.filter.weight = data.weight;
        },
        updateInfo: function() {
            const defaultInfo = this.conf.defaultInfo;
            const infos = this.conf.infos;
            if (defaultInfo) {
                this.village.setDefaultInfos(defaultInfo);
                if (typeof this.selectedHouse.idx === 'undefined') {
                    this.selectedHouse.info = defaultInfo;
                }
            }
            if (infos.length) {
                this.village.setInfos(infos);
                if (typeof this.selectedHouse.idx === 'number') {
                    this.selectedHouse.info = infos;
                }
            }
            Vue.set(this, 'selectedHouse', Object.assign({}, this.selectedHouse));
        },
        updateGroupList: function(groupList) {
            this.villageComputedShowList = [];
            this.groupListOldValue = groupList;
        },
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(v => v.name);
            this.houseList.push(HOUSE_EMPTY_NAME);
            this.village.get('§¤§infos§', true);
        },
        selectHouse: function(house, idx) {
            if (this.selectedHouse.idx === idx) {
                this.selectedHouse = {
                    info: this.village.defaultInfo,
                };
            } else {
                this.selectedHouse = {
                    house: house,
                    idx: idx,
                    info: this.village.infos[idx] || {
                        houses: [],
                        orientations: [],
                    },
                };
            }
        },
        changeHouse: function(info) {
            if (typeof this.selectedHouse.idx === 'number') {
                Vue.set(this.village.infos, this.selectedHouse.idx, info);
                const confInfos = this.conf.infos;
                confInfos[this.selectedHouse.idx] = info;
                Vue.set(this.conf, 'infos', confInfos.slice());
            } else {
                this.village.defaultInfo = info;
                Vue.set(this.conf, 'defaultInfo', info);
            }
            this.resetOffset();
        },
        compute: async function() {
            this.houseComputed = [];
            this.isRuning = true;
            this.isRequestOpen = false;
            this.isResultOpen = true;

            const houses = new Set();

            this.village.infos.forEach((info) => info.houses.forEach((house) => houses.add(house)));
            const defaultInfo = Object.assign({}, this.village.defaultInfo);
            if (defaultInfo.houses.length) {
                defaultInfo.houses.forEach((house) => houses.add(house));
            } else {
                const houseList = this.houseList;
                defaultInfo.houses = houseList;
                houseList.forEach((house) => houses.add(house));
            }
            if (!defaultInfo.orientations.length) {
                defaultInfo.orientations = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            }
            const mazes = {};
            const hasEmpty = houses.has(HOUSE_EMPTY_NAME);
            if (hasEmpty) {
                houses.delete(HOUSE_EMPTY_NAME);
                mazes[HOUSE_EMPTY_ID] = HOUSE_EMPTY;
            }
            const promises = Array.from(houses, (house) => store.house.get(house).then(h => mazes[house] = h)
                .catch((e) => console.info('There has been an error:', e)));

            this.status = 'running';

            await Promise.all(promises);

            this.startCompute = performance.now();
            worker('composition', {
                starts: this.village.listStart,
                ends: this.village.listEnd,
                nbPossibilities: this.nbPossibilities,
                infos: this.village.infos,
                defaultInfo: defaultInfo,
                mazes: mazes,
                mazeWidth: this.village.maze.length,
                mazeHeight: this.village.maze[0].length,
                mazeWidthHouse: confVillage.sizeX,
                mazeHeightHouse: confVillage.sizeY,
                houseWidth: confHouse.sizeX,
                houseHeight: confHouse.sizeY,
                useOnce: true,
                offset: this.offset,
                filter: this.filter,
            }, this.onComputeProgress.bind(this)).then(this.onComputeFinished.bind(this));
        },
        stopCompute: function() {
            this.isStopping = true;
            worker('stopComposition', {});
            if (this.status === 'running') {
                this.status = 'Stopped on demand';
            }
        },
        onComputeProgress: function(data) {
            const {progress, results, offset, isInPause} = data;
            const {computeProgress: currentProgress, offset: currentOffset} = this;
            const time1 = performance.now();

            if (progress > currentProgress) {
                this.computeProgress = progress;
            }
            if (offset > currentOffset) {
                this.offset = offset;
            }

            if (results) {
                results.forEach((response) => {
                    const {maze, houses, result} = response;
                    const houseId = houses.join('');
                    if (this.villageComputed.find(v => v.houseId === houseId)) {
                        // already displayed
                        return;
                    }

                    this.villageComputedNb++;
                    if (this.villageComputedNb >= this.resultLimitation) {
                        this.status = 'Limit of results reached';
                        this.stopCompute();
                    }

                    if (result.shortestPath instanceof Array) {
                        result.shortestPath = new Set(result.shortestPath);
                    }

                    this.villageComputed.push({
                        houseId: Object.freeze(houseId),
                        maze: Object.freeze(maze),
                        houses: Object.freeze(houses),
                        result: Object.freeze(result),
                        difficulty: Object.freeze(data.difficulty),
                        groupList: [],
                    });
                });
            }

            if (isInPause) {
                const time2 = performance.now();

                if (time2 - time1 > 100) {
                    setTimeout(() => {
                        worker('continueComposition', {
                            pause: isInPause,
                        });
                    }, 500);
                } else {
                    worker('continueComposition', {
                        pause: isInPause,
                    });
                }
            }
        },
        onComputeFinished: function(data) {
            this.isRuning = false;
            this.isStopping = false;
            this.computeProgress = data.progress;
            this.offset = data.offset;

            const oldSpeed = this.conf.timeByMaze; // (in maze / ms)
            const speed = this.speed * 1000; // (in M maze / s → maze / ms)
            this.conf.timeByMaze = (oldSpeed * 2 + speed) / 3;
            if (this.status === 'running') {
                this.status = 'Complete';
            }
        },
        save: function() {
            this.$refs.villageReesultDetails.save();
        },
        changedStateRequest: function(value) {
            this.isRequestOpen = value;
        },
        changedStateResult: function(value) {
            this.isResultOpen = value;
        },
        paginateResult: function() {
            this.resultDisplayLimitation += 10;
        },
        changeNbPossibilities: function(nbPossibilities) {
            this.nbPossibilities = nbPossibilities;
        },
        selectResult: function(id) {
            if (id === this.selectedResult.houseId) {
                this.selectedResult = {};
            } else {
                this.selectedResult = this.villageComputed.find(v => v.houseId === id);
            }
        },
        selectGroup: function(idx) {
            this.selectedGroup = idx;
            this.villageComputedShowList = [];
        },
        removeResult: function() {
            const selected = this.selectedResult;
            if (selected) {
                this.selectedResult = {};
                const id = selected.houseId;
                const idx = this.villageComputed.findIndex(v => v.houseId === id);
                if (idx !== -1) {
                    this.villageComputed.splice(idx, 1);
                    this.villageComputedNb--;
                    this.villageComputedShowList = [];
                }
            }
        },
        clearResult: function() {
            this.villageComputed=[];
            this.showRemoveResult=false;
            this.villageComputedShowList = [];
            this.resultDisplayLimitation = 10;
        },
        resetOffset: function() {
            this.computeProgress = -1;
            this.offset = 0;
            this.status = 'not started';
        },
        dropFile: function(evt) {
            this.dragFiles = evt.dataTransfer && evt.dataTransfer.files;
            this.dragover = false;
        },
        importResults: function(results) {
            results.forEach(houses => {
                const houseId = houses.join('');

                if (this.villageComputed.find(v => v.houseId === houseId)) {
                    // already displayed
                    return;
                }

                this.villageComputedNb++;

                this.villageComputed.push({
                    houseId,
                    houses: Object.freeze(houses),
                });
            });
        },

        /* Levenshtein estimation */
        stringMovements: function(result) {
            if (!result || !result.result.movements) {
                return '';
            }
            if (result.stringMovements) {
                return result.stringMovements;
            }

            const mvt = result.result.movements.join('');

            if (mvt) {
                result.stringMovements = mvt;
            }
            return mvt;
        },

        stringShortCells: function(result) {
            if (!result || !result.result.shortestPath) {
                return '';
            }
            if (result.stringShortCells) {
                return result.stringShortCells;
            }

            const stringShortCells = Array.from(result.result.shortestPath).map((cell) => {
                const [x, y] = cell.split(', ');
                const code = +x + (y * configurationHeight);
                return String.fromCharCode(code) + 32;
            }).join('');

            if (stringShortCells) {
                result.stringShortCells = stringShortCells;
            }
            return stringShortCells;
        },

        looksLike: function(result1, result2) {
            const id = result1.houseId + result2.houseId;
            if (this.storeDistance.has(id)) {
                return this.storeDistance.get(id);
            }
            const mvt1 = this.stringMovements(result1);
            const mvt2 = this.stringMovements(result2);

            const cell1 = this.stringShortCells(result1);
            const cell2 = this.stringShortCells(result2);

            const estimationMvt = levenshtein.percent(mvt1, mvt2);
            const estimationCell = levenshtein.percent(cell1, cell2);

            const result = (estimationMvt + estimationCell) / 2

            this.storeDistance.set(id, result);

            return result;
        },
    },
    watch: {
        watcherInfo: function() {
            this.updateInfo();
        },
        'village.disablingOutsideCells': function() {
            this.resetOffset();
        },
    },
    filters: {
        units: function(value) {
            let unit = ' M/s';

            if (value < 1) {
                unit = ' k/s';
                value *= 1000;
            }

            if (value < 1) {
                unit = ' /s';
                value *= 1000;
            }

            value =  Math.round(value * 10) / 10;

            return `${value} ${unit}`;
        },
    },
    components: {
        Village: VillageView,
        AskDialog: AskDialog,
        DetailsCustom: Details,
        HouseSelector: HouseSelector,
        RequestStatus: RequestStatus,
        VillageResult: VillageResult,
        VillageResultDetails: VillageResultDetails,
        ExportVillages: ExportVillages,
        ImportVillages: ImportVillages,
        VueSlider: VueSlider,
    },
};
</script>

<style scoped>
.details {
    margin-bottom: 1em;
}
.details.open {
    height: 90%;
}
.summary {
    display: flex;
    justify-content: space-between;
    /* grid-template: "header progess" 30px
                   "results details" 1fr
                   "results actions" 50px / 1fr 300px; */
    border-bottom: 1px solid var(--menu-background);
    padding-bottom: 0.5em;
}
header {
    width: calc(100% - 300px);
    text-align: center;
}
.info-progress {
    grid-area: progress;
    width: 300px;
}
progress {
    width: 80%;
}

.sharedArea {
    display: grid;
    grid-template:
        "filter svg action" 1fr
        "filter svg options" 1fr
        "filter . controls" 40px
        / 300px 1fr 300px;
    height: 90%;
}
.filter {
    grid-area: filter;
    border-right: var(--aside-left-border);
    padding: 1em;
    overflow: auto;
}
.action {
    grid-area: action;
}
.option {
    grid-area: options;
}
.sharedArea.resultArea {
    grid-template:
        "svg options" 1fr
        ". controls" 40px
        / 1fr 400px;
}
.slider {
    margin-top: 2em;
}
.body {
    height: 100%;
    background-color: red;
}
h2 {
    margin: 0;
}
.svg,
.village-result {
    grid-area: svg;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    overflow: auto;
}
.village-result-item {
    width: 200px;
    margin: 5px;
}
aside {
    border-left: var(--aside-left-border);
    border-top: var(--aside-top-border);
    padding: 1em;
    overflow: auto;
}
.controls {
    grid-area: controls;
    border-top: var(--aside-top-border);
    padding: 5px;
    padding-bottom: 0;
}
.controls button {
    height: 30px;
}

.controls-compute {
    text-align: center;
    width: 300px;
}
progress:not([value]) {
    width: 25%;
}

.noResult {
    font-size: 1.5em;
    font-style: italic;
    margin: 1em;
    margin-left: 0;
    flex-grow: 1;
}

.result-selected {
    background-color: var(--selected-item-background);
}

/* .dragover {
    border: 5px dotted var(--selected-item-background);
} */

.dragmask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--selected-item-background);
    opacity: 0.2;
    z-index: var(--layer-mask-drop);
}

/* progress[value]::-webkit-progress-bar {
  background-image:
	   -webkit-linear-gradient(left,
	                           transparent 50%,
                               rgba(0, 0, 0, 0.1) 50%,
	                           rgba(0, 0, 0, 0.1) 70%,
                               transparent 70%),
	   -webkit-linear-gradient(top,
	                           rgba(0, 0, 0, 0.25),
	                           rgba(255, 255, 255, 0.25)
                               ),
	   -webkit-linear-gradient(left, rgba(250, 50, 20, 0.8) 10%, rgba(225, 220, 100, 0.8) 50%, rgba(255, 250, 50, 0.8) 90%, rgba(155, 225, 50, 0.8));

    background-size: 20px 20px, 100% 100%, 100% 100%;
}


progress[value]::-webkit-progress-value {
  background-image:
	   -webkit-linear-gradient(-45deg,
	                           transparent 33%,
                               rgba(0, 0, 0, 0.1) 33%,
	                           rgba(0, 0, 0, 0.1) 66%,
                               transparent 66%),
	   -webkit-linear-gradient(top,
	                           rgba(255, 255, 255, 0.25),
	                           rgba(0, 0, 0, 0.25)),
	   -webkit-linear-gradient(left, rgb(0, 20, 200), rgb(120, 170, 255));

    border-radius: 2px;
    background-size: 40px 40px, 100% 100%, 100% 100%;
} */

</style>
