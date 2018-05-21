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
            <aside>
                <header>Options</header>
            </aside>
            <div class="controls">
                <button
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
import VillageView from '@/components/village/SvgVillage';
// import HouseAction from '@/components/village/HouseAction';
// import VillageAnalyze from '@/components/village/VillageAnalyze';
import AskDialog from '@/components/AskDialog';

const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh();

        return {
            isRequestOpen: true,
            isResultOpen: false,
            village: new Village(),
            houseList: [],
            selectedHouse: {},
            computeProgress: 25,
        };
    },
    computed: {
    },
    methods: {
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(v => v.name);
            this.village.get('', true);
        },
        // save: function() {
        //     this.askDialog = true;
        // },
        // checkSave: async function() {
        //     if (!this.village.name) {
        //         return;
        //     }
        //     await this.village.save();
        //     this.refresh();
        //     this.askDialog = false;
        // },
        selectHouse: function(house, idx) {
            if (this.selectedHouse.idx === idx) {
                this.selectedHouse = {};
            } else {
                this.selectedHouse = {
                    house: house,
                    idx: idx,
                };
            }
            console.log(house, idx);
        },
        changeHouse: function(house) {
            Vue.set(this.village.infos, this.selectedHouse.idx, house);
            this.selectedHouse = {
                house: house,
                idx: this.selectedHouse.idx,
            };
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
    },
    components: {
        Village: VillageView,
        AskDialog: AskDialog,
        DetailsCustom: Details,
        HouseSelector: HouseSelector,
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
        "svg options" 2fr
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
