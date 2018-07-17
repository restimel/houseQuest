<template>
<div class="composition">
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
            <Village
                class="svg"
                :village="village"
                :selected="selectedHouse"
                display="info"
                :changeDisplay="false"
                @selection="selectHouse"
            />
            <HouseSelector
                :selected="selectedHouse"
                @change="changeHouse"
            />
            <RequestStatus
                :village="village"
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
                    Result
                    <span v-if="villageComputed.length > 0">({{villageComputed.length}})</span>
                </h2>
            </header>
            <div class="controls-compute">
                <button v-if="!isRuning"
                    :disabled="!canCompute"
                    :title="statusCompute"
                    @click.stop="compute"
                >
                    Compute <span v-show="continueComputation">(continue)</span>
                </button>
                <button v-else
                    :disabled="isStopping"
                    @click.stop="stopCompute"
                >
                    <span v-if="!isStopping">Stop</span>
                    <span v-else>Stopping...</span>
                </button>
                <progress v-show="isRuning"/>
                <span v-show="isRuning" title="Average speed of computation (in number of position computed per second)">{{ this.speed | dec1 }}M /s</span>
            </div>
        </div>
        <div slot="body" class="sharedArea resultArea">
            <div class="village-result">
                <span v-if="villageComputed.length === 0"
                    class="noResult"
                >
                    No results found yet :/
                </span>
                <VillageResult v-for="(vResult, idx) of villageComputedDisplayed"
                    :key="'villageResult' + idx"
                    class="village-result-item"
                    :class="{'result-selected': selectedResult.houseId === vResult.houseId}"
                    :result="vResult"
                    summary="true"
                    @click="selectResult(vResult.houseId)"
                />
                <div
                    v-show="villageComputed.length - villageComputedDisplayed.length > 0"
                    class=""
                >
                    There are also {{villageComputed.length - villageComputedDisplayed.length}} more result.
                </div>
            </div>
            <VillageResultDetails
                class="result-details"
                :result="selectedResult"
                ref="villageReesultDetails"
            />
            <div class="controls" v-show="!!selectedResult.houseId">
                <button
                    @click="removeResult"
                >
                    Remove from result
                </button>
                <button
                    @click="save"
                >
                    Save
                </button>
            </div>
        </div>
    </DetailsCustom>
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
import AskDialog from '@/components/AskDialog';
import worker from '@/core/worker';

import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh();

        const village = new Village({
            propsData: {
                withoutAnalyze: true,
            },
        });

        return {
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
            resultLimitation: 50,
            villageComputedNb: 0,
            startCompute: -1,
            conf: conf,
            status: 'not started',

            selectedResult: {},
        };
    },
    computed: {
        canCompute: function() {
            return this.nbPossibilities > this.offset && this.village.starts.length && this.village.ends.length;
        },
        statusCompute: function() {
            let text = '';
            if (this.nbPossibilities <= this.offset) {
                text = 'All possibilities are already computed';
            } else
            if (!this.village.starts.length || !this.village.ends.length) {
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
        watcherInfo: function() {
            return (this.conf.infos, this.conf.defaultInfo, Date.now());
        },
        continueComputation: function() {
            return this.canCompute && this.offset > 0;
        },
        villageComputedDisplayed: function() {
            return this.villageComputed.slice(0, this.resultLimitation);
        },
    },
    created: function() {
        this.updateInfo();
    },
    methods: {
        updateInfo: function() {
            const defaultInfo = this.conf.defaultInfo;
            const infos = this.conf.infos;
            if (defaultInfo) {
                this.village.defaultInfo = defaultInfo;
                if (typeof this.selectedHouse.idx === 'undefined') {
                    Vue.set(this.selectedHouse, 'info', defaultInfo);
                }
            }
            if (infos.length) {
                this.village.infos = infos;
                if (typeof this.selectedHouse.idx === 'number') {
                    Vue.set(this.selectedHouse, 'info', infos);
                }
            }
        },
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(v => v.name);
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
                this.conf.defaultInfo = info;
            }
            this.computeProgress = -1;
            this.offset = 0;
            this.status = 'not started';
        },
        compute: async function() {
            this.houseComputed = [];
            this.isRuning = true;
            this.isRequestOpen = false;
            this.isResultOpen = true;

            const houses = new Set();

            this.startCompute = performance.now();

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
            const promises = Array.from(houses, (house) => store.house.get(house).then(h => mazes[house] = h));

            this.status = 'running';

            await Promise.all(promises);
            worker('composition', {
                starts: this.village.starts,
                ends: this.village.ends,
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
            const {progress, maze, houses, offset} = data;
            const {computeProgress: currentProgress, offset: currentOffset} = this;

            if (progress > currentProgress) {
                this.computeProgress = progress;
            }
            if (offset > currentOffset) {
                this.offset = offset;
            }

            if (houses || maze) {
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

                setTimeout(() => {
                    this.villageComputed.push({
                        houseId,
                        maze,
                        houses,
                        result: data.result,
                        difficulty: data.difficulty,
                    });
                }, 10);
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
        removeResult: function() {
            const selected = this.selectedResult;
            if (selected) {
                this.selectedResult = {};
                const id = selected.houseId;
                const idx = this.villageComputed.findIndex(v => v.houseId === id);
                if (idx !== -1) {
                    this.villageComputed.splice(idx, 1);
                    this.villageComputedNb--;
                }
            }
        }
    },
    watch: {
        watcherInfo: function() {
            this.updateInfo();
        },
        'village.disablingOutsideCells': function() {
            this.offset = 0;
        },
    },
    filters: {
        dec1: function(value) {
            return Math.round(value * 10) / 10;
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
        "svg action" 1fr
        "svg options" 1fr
        ". controls" 40px
        / 1fr 300px;
    height: 90%;
}
.sharedArea.resultArea {
    grid-template:
        "svg options" 1fr
        ". controls" 40px
        / 1fr 400px;
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
    cursor: pointer;
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
