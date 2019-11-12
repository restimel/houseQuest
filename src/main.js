// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Directives from './directives/directivesLoader';
import router from './router';
import init from './initialization';

Vue.config.productionTip = false;

String.prototype.firstUpper = function() {
    const firstLetter = this[0].toUpperCase();
    return firstLetter + this.slice(1);
};

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    mounted: init,
});
