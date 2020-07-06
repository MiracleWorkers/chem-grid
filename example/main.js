import Vue from 'vue';
import { instance } from './http';
import ChemTable from '../src/index';
import './theme.scss';
Vue.use(ChemTable, {
  httpInstance: instance
});

import App from './App';

new Vue({
  render: h => h(App)
}).$mount('#app');
