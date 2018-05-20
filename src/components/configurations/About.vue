<template>
    <section>
        <header><h1>About houseQuest</h1></header>
        <ul>
            <li v-for="item of list" :key="item.name"
                @click="egg(item.name)"
            >
                <span class="item-name">
                    {{item.name}}:
                </span>
                <span class="item-value">
                    {{item.value}}
                </span>
            </li>
        </ul>
    </section>
</template>
<script>

export default {
    name: 'about',
    data: function() {
        return {
            data: [{
                name: 'Author',
                value: 'Benoît Mariat',
            }, {
                name: 'Origina idea of the game',
                value: 'Romain-Guirec Piotte',
            }, {
                name: 'Date',
                value: '12 / 05 / 2018',
            }, {
                name: 'licence',
                value: 'MIT',
            }],
            addedData: [{
                name: 'Written in Austria and Switzerland',
                value: '08/05/2018 → 20/05/2018',
            }],
            added: false,
        };
    },
    computed: {
        list: function() {
            if (this.added) {
                return this.data.concat(this.addedData);
            } else {
                return this.data;
            }
        },
    },
    methods: {
        egg: function(name) {
            if (name === 'Date') {
                this.added = true;
            }
        },
    },
};

</script>

<style scoped>
ul {
    text-align: left;
}
</style>
