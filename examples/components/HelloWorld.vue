<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <chem-grid
      style="width: 900px;height: 300px"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :enableRangeSelection="true"
      :rowData="rowData"
    ></chem-grid>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {
        field: "athlete",
        width: 150
      },
      {
        field: "age",
        width: 90
      },
      {
        field: "country",
        width: 120
      },
      {
        field: "year",
        width: 90
      },
      {
        field: "date",
        width: 110
      },
      {
        field: "sport",
        width: 110
      },
      {
        field: "gold",
        width: 100
      },
      {
        field: "silver",
        width: 100
      },
      {
        field: "bronze",
        width: 100
      },
      {
        field: "total",
        width: 100
      }
    ];
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onGridReady() {
      const httpRequest = new XMLHttpRequest();
      const updateData = data => {
        this.rowData = data;
      };

      httpRequest.open(
        "GET",
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
      );
      httpRequest.send();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          updateData(JSON.parse(httpRequest.responseText));
        }
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
