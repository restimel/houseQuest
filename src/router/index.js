import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main.vue';
import VillageEditor from '@/components/VillageEditor.vue';
import HouseEditor from '@/components/HouseEditor.vue';
import VillageCompositor from '@/components/VillageCompositor.vue';
import ImportExport from '@/components/ImportExport.vue';
import ConfigAbout from '@/components/ConfigAbout.vue';
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
            path: '/house',
            name: 'House',
            component: HouseEditor,
        },
        {
            path: '/composition',
            name: 'Compositor',
            component: VillageCompositor,
        },
        {
            path: '/importExport',
            name: 'ImportExport',
            component: ImportExport,
        },
        {
            path: '/about',
            name: 'ConfigAbout',
            component: ConfigAbout,
        },
        {
            path: '*',
            name: 'Default',
            component: ErrorPage,
            props: (route) => ({ route: route.path }),
        },
    ],
});
