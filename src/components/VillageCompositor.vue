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
                <progress min="0" max="100" :value="computeProgress" />
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
            <div class="controls">
                <button
                    :disabled="!canCompute"
                    @click="compute"
                >
                    Compute
                </button>
            </div>
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
            <div class="info-progress">
                <progress min="0" max="100" :value="computeProgress" />
            </div>
        </div>
        <div slot="body" class="sharedArea">
            <Village
                :village="village"
                :selected="selectedHouse"
                display="info"
                @selection="selectHouse"
            />
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
import VillageView from '@/components/village/SvgVillage';
import AskDialog from '@/components/AskDialog';

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh();

        const village = new Village();

        return {
            isRequestOpen: true,
            isResultOpen: false,
            village: village,
            houseList: [],
            selectedHouse: {
                info: village.defaultInfo,
            },
            nbPossibilities: 0,
            computeProgress: 33,
        };
    },
    computed: {
        canCompute: function() {
            return this.nbPossibilities > 0;
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
            if (this.selectedHouse.idx) {
                Vue.set(this.village.infos, this.selectedHouse.idx, info);
            } else {
                this.village.defaultInfo = info;
            }
        },
        compute: function() {
            console.log('TODO compute')
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
    },
    components: {
        Village: VillageView,
        AskDialog: AskDialog,
        DetailsCustom: Details,
        HouseSelector: HouseSelector,
        RequestStatus: RequestStatus,
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
    /* grid-template: "header progess" 30px / 1fr 300px; */
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
    width: 100%;
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
svg {
    grid-area: svg;
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
</style>