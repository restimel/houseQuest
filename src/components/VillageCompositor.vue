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
                    <progress min="0" max="1" :value="computeProgress" />
                    <span>{{Math.round(computeProgress * 1000)/10}}%</span>
                </template>
            </div>
        </div>
        <section
            class="sharedArea"
            slot="body"
        >   
            <Village
                :village="village"
                :selected="selectedHouse"
                display="info"
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
            <!-- <div class="controls">
                <button v-if="!isRuning"
                    :disabled="!canCompute"
                    @click="compute"
                >
                    Compute
                </button>
                <button v-else
                    @click="stopCompute"
                >
                    Stop
                </button>
            </div> -->
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
                <h2>Result</h2>
            </header>
            <div class="controls-compute">
                <button v-if="!isRuning"
                    :disabled="!canCompute"
                    @click="compute"
                >
                    Compute
                </button>
                <button v-else
                    @click="stopCompute"
                >
                    Stop
                </button>
                <progress v-show="isRuning" />
            </div>
        </div>
        <div slot="body" class="sharedArea">
            <div class="village-result">
                <span v-if="villageComputed.length === 0"
                    class="noResult"
                >
                    No results found yet :/
                </span>
                <VillageResult v-for="(vResult, idx) of villageComputed"
                    :key="'villageResult' + idx"
                    class="village-result-item"
                    :result="vResult"
                    summary="true"
                    @click="selectResult(idx)"
                />
            </div>
            <aside>
                TODO
            </aside>
            <aside>
                <header>Options</header>
            </aside>
            <div class="controls">
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
import store from '@/core/indexedDB';
import Village from '@/models/village';
import Details from '@/components/Details';
import HouseSelector from '@/components/composition/HouseSelector';
import RequestStatus from '@/components/composition/RequestStatus';
import VillageResult from '@/components/composition/VillageResult';
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
            withoutAnalyze: true,
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
            villageComputed: [],
            offset: 0,
            resultLimitation: 10,
        };
    },
    computed: {
        canCompute: function() {
            return this.nbPossibilities > this.offset;
        },
    },
    methods: {
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(v => v.name);
            this.village.get('', true);
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
            } else {
                this.village.defaultInfo = info;
            }
        },
        compute: async function() {
            this.houseComputed = [];
            this.isRuning = true;
            this.isRequestOpen = false;
            this.isResultOpen = true;

            const houses = new Set();
            //DEBUG
            // this.village.infos.forEach((info, i) => {
            //     info.houses = ['House ' + (i + 1)];
            // });
            this.offset = 0;

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

            await Promise.all(promises);
            worker('composition', {
                starts: confVillage.starts,
                ends: confVillage.ends,
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
            worker('stopComposition', {});
        },
        onComputeProgress: function(data) {
            const {progress, maze, houses} = data;

            this.computeProgress = progress;
            this.offset = data.offset;

            if (maze) {
                if (this.villageComputed.length + 1 >= this.resultLimitation) {
                    console.log('Stop there are too much result', this.villageComputed.length)
                    this.stopCompute();
                }

                this.villageComputed.push({
                    maze,
                    houses,
                    result: data.result,
                    difficulty: data.difficulty,
                });
            }
        },
        onComputeFinished: function(data) {
            this.isRuning = false;
            this.computeProgress = data.progress;
            this.offset = data.offset;
        },
        save: function() {
            console.log('TODO save')
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
        selectResult: function(idx) {
            console.log('A result is selected: ', idx);
        },
    },
    components: {
        Village: VillageView,
        AskDialog: AskDialog,
        DetailsCustom: Details,
        HouseSelector: HouseSelector,
        RequestStatus: RequestStatus,
        VillageResult: VillageResult,
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

/* details > p {
    height: 100%;
} */
.sharedArea {
    display: grid;
    grid-template:
        "svg action" 1fr
        "svg options" 1fr
        ". controls" 40px
        / 1fr 300px;
    height: 90%;
}
.body {
    height: 100%;
    background-color: red;
}
h2 {
    margin: 0;
}
svg,
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

</style>
