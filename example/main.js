import Vue from 'vue';
import axios from './http';
import ChemTable from '../src/index';
Vue.use(ChemTable, {
  httpInstance: axios
});

Vue.prototype.$http = axios;
import App from './App';

new Vue({
  render: h => h(App)
}).$mount('#app');
