import Vue from 'vue';

export default Vue.extend({
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  mounted() {
    this.sleep(2000);
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6]
    };
  },
  render() {
    return (
      <div class="customize_box">
        {this.list.map(item => {
          return <span>{item}</span>;
        })}
      </div>
    );
  }
});
