<template>
  <ag-grid-vue class="ag-theme-balham" v-bind="mergeAttrs" v-on="$listeners"></ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import localeText from "./zh-CN";
export default {
  name: "chem-grid",
  inheritAttrs: true,
  components: { AgGridVue },
  computed: {
    mergeAttrs() {
      return Object.assign(
        {
          localeText: Object.freeze(localeText)
        },
        this.$attrs
      );
    }
  }
};
</script>