<template>
<aside>
    <template v-if="hasResult">
        <header>
            Village Analysis
        </header>
        <div v-show="isResolvable" class="information difficulty">
            <meter
                title="Estimation of this maze's difficulty"
                min="0"
                optimum="0"
                max="100"
                :value="difficultyEstimation"
                low="35"
                high="70"
                @click="showWeight=true;"
            >
                Difficulty of this maze
            </meter>
            <span class="percentInfo">
                {{difficultyPercent}}
            </span>
        </div>
        <div v-if="!isResolvable" class="information notResolvable"
            title="It is not possible to find a path from start to end"
        >
            Not resolvable!
        </div>
        <div v-else class="information resolvable"
            title="It is possible to find at least a path from start to end"
        >
            Is resolvable
        </div>

        <div class="item"
            title="Number of cell which is possible to access from starting cells"
        >
            Number of accessible cells:
            <span class="computed">
                {{result.nbCellAccessible}}
            </span>
        </div>
        
        <template v-if="isResolvable">
            <div class="item"
                title="Minimum number of cells to go through from start to end."
            >
                Shortest path:
                <span class="computed">
                    {{result.nbShortestPath}}
                </span>
            </div>
            <div class="item"
                title="Number of movements needed to go from start to end."
            >
                Number of movements:
                <span class="computed">
                    {{nbMovements}}
                </span>
            </div>
            <div class="item"
                title="Number of movements where result depends of speed of moving the maze."
            >
                Number of complex movements:
                <span class="computed">
                    {{result.complexMovements}}
                </span>
            </div>
            <div class="item"
                title="Number of movements where it is quite hard to do (such as diagonal move)."
            >
                Number of hard movements:
                <span class="computed">
                    {{result.hardMovements}}
                </span>
            </div>

            <details class="item movements">
                <summary>
                    Movements:
                </summary>
                <p>
                    {{readableMovements}}
                </p>
            </details>
        </template>
        <Weight
            :show="showWeight"
            :weight="weight"
            @input="changeWeight"
            @confirm="showWeight=false;"
            @reset="getFromStore(true)"
        />
    </template>
    <div v-else
        class="defaultMsg"
    >
        Not analyzed yet...
    </div>
</aside>
</template>

<script>
import Weight from '@/components/village/DifficultyWeight';
import store from '@/core/indexedDB';
import configuration from '@/configuration';
const {village: confVillage, house: confHouse} = configuration;

export default {
    name: 'VillageAnalysis',
    props: {
        result: {
            type: Object,
            default: function() {
                return {};
            },
        },
    },
    data: function() {
        this.getFromStore();
        return {
            weight: {},
            showWeight: false,
        };
    },
    computed: {
        sizeX: function() {
            return confVillage.sizeX * confHouse.sizeX;
        },
        hasResult: function() {
            return typeof this.result.nbCellAccessible === 'number';
        },
        isResolvable: function() {
            return isFinite(this.result.nbShortestPath);
        },
        nbMaxCells: function() {
            return confVillage.sizeX * confVillage.sizeY * confHouse.sizeX * confHouse.sizeY + confVillage.starts.length + confVillage.ends.length;
        },
        nbMovements: function() {
            return this.result.movements.length - 1;
        },
        readableMovements: function() {
            const convert = {
                '': ' ',
                '-': ' ',
                'u': '↑',
                'd': '↓',
                'l': '←',
                'r': '→',
                'ul': '↖',
                'ur': '↗',
                'dr': '↘',
                'dl': '↙',
                '-d': '↑',
                '-u': '↓',
                '-r': '←',
                '-l': '→',
                '-dr': '↖',
                '-dl': '↗',
                '-ul': '↘',
                '-ur': '↙',
            };
            return this.result.movements.map(d => convert[d] || '?').join(' ');
        },
        difficultyMax: function() {
            const weight = this.weight;
            const nbCell = 1 * weight.nbCellAccessible;
            const nbShtPath = 1 * weight.nbShortPath;
            const nbMovements = 1 * weight.nbMovements;
            const nbComplexMove = 1 * weight.nbComplexMove;
            const nbHardMove = 1 * weight.nbHardMove;
            return 0.01 + nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
        },
        difficulty: function() {
            const weight = this.weight;
            const nbCell = (this.result.nbCellAccessible / this.nbMaxCells) * weight.nbCellAccessible;
            const nbShtPath = (this.result.nbShortestPath / this.nbMaxCells) * weight.nbShortPath;
            const nbMovements = (this.nbMovements / (this.nbMaxCells - confVillage.sizeX)) * weight.nbMovements;
            const nbComplexMove = this.asymptotic(this.result.complexMovements, this.sizeX, 6) * weight.nbComplexMove;
            const nbHardMove = this.asymptotic(this.result.hardMovements, 9, 3) * weight.nbHardMove;
            return 0.01 + nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
        },
        difficultyEstimation: function() {
            const value = this.asymptotic(this.difficulty, this.difficultyMax, 5);
            return Math.round(value * 10000) / 100;
        },
        difficultyPercent: function() {
            return this.difficultyEstimation + '%';
        },
    },
    methods: {
        asymptotic: function (x, Tmax = 100, Quickness = 1) {
            return (1 - Tmax / ( Quickness * x + Tmax));
        },
        changeWeight: function(value) {
            this.weight = value;
            store.configuration.set('weight', {
                type: 'weight',
                weight: value
            });
        },
        getFromStore: async function(forceReset) {
            let data;
            if (!forceReset) {
                data = await store.configuration.get('weight');
            }
            if (!data) {
                data = await store.configuration.get('defaultWeight') || {};
            }
            this.weight = data.weight;
        },
    },
    components: {
        Weight: Weight,
    },
};
</script>

<style scoped>
.defaultMsg {
    font-style: italic;
}
header {
    margin-bottom: 0.5em;
}
.item {
    text-align: left;
}
.information {
    text-align: center;
    margin-bottom: 0.5em;
    font-weight: bold;
}
.difficulty {
    cursor: pointer;
}
meter {
    width: 75%;
    height: 1.4em;
}
.computed {
    font-weight: bold;
}
.notResolvable {
    color: var(--information-not-resolvable);
}
.resolvable {
    color: var(--information-resolvable);
}

.movements {
    margin-top: 1em;
}
.percentInfo {
    font-size: 0.8em;
    margin-left: 1em;
}
</style>
