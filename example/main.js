import Vue from 'vue';
import { instance } from './http';

import ChemTable from '../dist/chem-grid';
// import ChemTable from '../src/index';
import './theme.scss';
Vue.use(ChemTable, {
  tagName: 'x-table',
  httpInstance: instance
});

import App from './App';

new Vue({
  render: h => h(App)
}).$mount('#app');
