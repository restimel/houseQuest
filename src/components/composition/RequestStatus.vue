<template>
<aside class="requestStatus">
    <div class="defaultInfo">
        <header>Default status</header>
        <label class="label-info">
            <span class="label-title">Houses</span>:
            <output>{{defaultHouses}}</output>
        </label>
        <label class="label-info">
            <span class="label-title">Orientations</span>:
            <output>{{defaultOrientations}}</output>
        </label>
    </div>
    <div class="requestInfo">
        <header>Request estimation</header>
        <label class="label-info">
            <span class="label-title">
                Estimation time</span>:
            <output>
                {{timeEstimation}}
            </output>
        </label>
    </div>
</aside>
</template>

<script>
import store from '@/core/indexedDB';
import Village from '@/models/village';
import conf from '@/models/configurations';

const arrows = {
    'UP': '↑',
    'DOWN': '↓',
    'LEFT': '←',
    'RIGHT': '→',
};

export default {
    name: 'RequestStatus',
    props: {
        village: {
            type: Village,
            require: true,
        },
        list: {
            type: Array,
        },
    },
    data: function() {
        if (this.list) {
            this.refresh();
        }
        return {
            conf: conf,
            houseList: this.list || [],
        };
    },
    computed: {
        houseListLength: function() {
            return this.houseList.length;
        },
        defaultHouses: function() {
            const houses = this.village.defaultInfo.houses;
            const length = houses.length;
            const houseListLength = this.houseListLength;

            if (length === 0 || length === houseListLength) {
                return `All (${houseListLength} houses)`;
            }

            return houses.join(', ');
        },
        defaultOrientations:  function() {
            const orientations = this.village.defaultInfo.orientations;
            const length = orientations.length;

            if (length === 0 || length === 4) {
                return 'All (4 orientations)';
            }

            return orientations.map(o => arrows[o]).join(', ');
        },
        defaultNbHouses: function() {
            return this.getNb(this.village.defaultInfo.houses, this.houseListLength);
        },
        defaultNbOrientations: function() {
            return this.getNb(this.village.defaultInfo.orientations, 4);
        },
        nbPossibilities: function() {
            let nbPossibilities;

            nbPossibilities = this.village.infos.reduce((total, info) => {
                const nbHouses = this.getNb(info.houses, this.defaultNbHouses);
                const nbOrientations = this.getNb(info.orientations, this.defaultNbOrientations);
                return total * nbHouses * nbOrientations;
            }, 1);

            this.$emit('nbPossibilities', nbPossibilities);
            return nbPossibilities;
        },
        timeEstimation: function() {
            const format = [];
            const nbPreviousGranularity = 3;
            let granularity = '';
            let nbPossibilities = this.nbPossibilities / this.conf.timeByMaze; // (in ms)

            // compute duration
            const nbmsInDay = 3600000 * 24;
            if (['', 'w'].includes(granularity) && nbPossibilities >= nbmsInDay) {
                const d = Math.floor(nbPossibilities / nbmsInDay);
                nbPossibilities -= d * nbmsInDay;
                format.push(d, ' days, ');

                if (!granularity) {
                    granularity = d > nbPreviousGranularity ? 'w' : 'd';
                }
            }
            if (['', 'd'].includes(granularity) && nbPossibilities >= 3600000) {
                const h = Math.floor(nbPossibilities / 3600000);
                nbPossibilities -= h * 3600000;
                format.push(h, 'h ');

                if (!granularity) {
                    granularity = h > nbPreviousGranularity ? 'd' : 'h';
                }
            }
            if (['', 'h'].includes(granularity) && nbPossibilities >= 60000) {
                const m = Math.floor(nbPossibilities / 60000);
                nbPossibilities -= m * 60000;
                format.push(m, 'min ');

                if (!granularity) {
                    granularity = m > nbPreviousGranularity ? 'h' : 'min';
                }
            }
            if (['', 'min'].includes(granularity) && nbPossibilities >= 1000) {
                const s = Math.floor(nbPossibilities / 1000);
                nbPossibilities -= s * 1000;
                format.push(s, 's ');

                if (!granularity) {
                    granularity = s > nbPreviousGranularity ? 'h' : 's';
                }
            }
            if (['', 's'].includes(granularity) && nbPossibilities > 0) {
                format.push(Math.round(nbPossibilities), 'ms');
            }

            return format.join('');
        },
    },
    methods: {
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(h => h.name);
        },
        getNb: function(list, defaultValue) {
            if (list.length === 0) {
                return defaultValue;
            }
            return list.length;
        },
    },
};
</script>

<style scoped>
.defaultInfo {
    margin-bottom: 1em;
}
.label-info {
    display: block;
    margin-top: 0.8em;
    text-align: left;
}
.label-title {
    font-weight: bold;
}
</style>
