import "chem-table-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import chemGrid from "./grid.vue"

export default {
  install: (Vue) => {
    Vue.component('chem-grid', chemGrid)
  }
}