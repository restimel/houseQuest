import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faTrashAlt, faSave, faCalculator, faEraser, faFileImport, faPlus, faTimes,
    faLongArrowAltUp, faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* https://fontawesome.com/icons?d=gallery&m=free */
library.add(
    faTrashAlt, faSave, faCalculator, faEraser, faFileImport, faPlus, faTimes,
    faLongArrowAltUp, faLongArrowAltDown,
);

Vue.component('Icon', FontAwesomeIcon);
