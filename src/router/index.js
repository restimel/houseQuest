import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main.vue';
import VillageEditor from '@/components/VillageEditor.vue';
import ErrorPage from '@/components/Error.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main,
        },
        {
            path: '/village',
            name: 'Village',
            component: VillageEditor,
        },
        {
            path: '*',
            name: 'Default',
            component: ErrorPage,
            props: (route) => ({ route: route.path }),
        },
    ],
});
