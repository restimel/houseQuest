<template>
<aside>
    <template v-if="hasResult">
        <header>
            Village Analysis
        </header>
        <meter v-show="isResolvable"
            title="difficulty of this maze"
            min="0"
            optimum="0"
            :max="difficultyMax"
            :value="difficulty"
            :low="difficultyMax * 0.33"
            :high="difficultyMax * 0.66"
        >
            difficulty of this maze
        </meter>
        <div v-if="!isResolvable" class="item notResolvable"
            title="It is not possible to find a path from start to end"
        >
            Not resolvable!
        </div>
        <div v-else class="item resolvable"
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
        <div class="item"
            title="Minimum number of cells to go through from start to end."
        >
            Shortest path:
            <span class="computed">
                {{result.nbShortestPath}}
            </span>
        </div>
    </template>
    <div v-else
        class="defaultMsg"
    >
        Not analyzed yet...
    </div>
</aside>
</template>

<script>
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
        return {
            weight: {
                nbCellAccessible: 100,
                nbShortPath: 100,
            },
        };
    },
    computed: {
        hasResult: function() {
            return typeof this.result.nbCellAccessible === 'number';
        },
        isResolvable: function() {
            return isFinite(this.result.nbShortestPath);
        },
        nbMaxCells: function() {
            return confVillage.sizeX * confVillage.sizeY * confHouse.sizeX * confHouse.sizeY + confVillage.starts.length + confVillage.ends.length;
        },
        difficultyMax: function() {
            const weight = this.weight;
            const nbCell = 1 * weight.nbCellAccessible;
            const nbShtPath = 1 * weight.nbShortPath;
            return nbCell + nbShtPath;
        },
        difficulty: function() {
            const weight = this.weight;
            const nbCell = (this.result.nbCellAccessible / this.nbMaxCells) * weight.nbCellAccessible;
            const nbShtPath = (this.result.nbShortestPath / this.nbMaxCells) * weight.nbShortPath;
            return nbCell + nbShtPath;
        },
    },
    methods: {
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
.computed {
    font-weight: bold;
}
.notResolvable {
    color: red;
}
.resolvable {
    color: green;
}
</style>
