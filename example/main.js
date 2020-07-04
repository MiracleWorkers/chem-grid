import Vue from 'vue';
import { instance } from './http';
import ChemTable from '../src/index';
Vue.use(ChemTable, {
  httpInstance: instance
});

import App from './App';

new Vue({
  render: h => h(App)
}).$mount('#app');
