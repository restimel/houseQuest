<template>
<aside>
    <template v-if="hasResult">
        <header>
            Village Analysis
        </header>
        <div v-show="isResolvable">
            <meter
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
            <span class="percentInfo">
                {{difficultyPercent}}
            </span>
        </div>
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
                nbCellAccessible: 10,
                nbShortPath: 10,
                nbMovements: 10,
                nbComplexMove: 5,
                nbHardMove: 20,
            },
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
            console.log(this.result.movements);
            return this.result.movements.length;
        },
        readableMovements: function() {
            const convert = {
                'u': '↑',
                'd': '↓',
                'l': '←',
                'r': '→',
                '-d': '↑',
                '-u': '↓',
                '-r': '←',
                '-l': '→',
            };
            return this.result.movements.map(d => convert[d]).join(' ');
        },
        difficultyMax: function() {
            const weight = this.weight;
            const nbCell = 1 * weight.nbCellAccessible;
            const nbShtPath = 1 * weight.nbShortPath;
            const nbMovements = 1 * weight.nbMovements;
            const nbComplexMove = 1 * weight.nbComplexMove;
            const nbHardMove = 1 * weight.nbHardMove;
            return nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
        },
        difficulty: function() {
            const fSx = (x, T, I) => (1 - T / (I * x + T));
            const weight = this.weight;
            const nbCell = (this.result.nbCellAccessible / this.nbMaxCells) * weight.nbCellAccessible;
            const nbShtPath = (this.result.nbShortestPath / this.nbMaxCells) * weight.nbShortPath;
            const nbMovements = (this.nbMovements / (this.nbMaxCells - confVillage.sizeX)) * weight.nbMovements;
            const nbComplexMove = fSx(this.result.complexMovements, this.sizeX, 6) * weight.nbComplexMove;
            const nbHardMove = fSx(this.result.hardMovements, 9, 3) * weight.nbHardMove;
            return nbCell + nbShtPath + nbMovements + nbComplexMove + nbHardMove;
        },
        difficultyPercent: function() {
            const percent = Math.round(this.difficulty / this.difficultyMax * 10000) / 100;
            return percent + '%';
        },
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
