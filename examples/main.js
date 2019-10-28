import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import chemGrid from "../src/index";
Vue.use(chemGrid);

new Vue({
  render: h => h(App)
}).$mount("#app");
