import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faSave, faCalculator, faEraser, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* https://fontawesome.com/icons?d=gallery&m=free */
library.add(faTrashAlt, faSave, faCalculator, faEraser, faFileImport);

Vue.component('Icon', FontAwesomeIcon);
