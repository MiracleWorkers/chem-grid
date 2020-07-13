import '../styles/baseCheckbox.scss';

// -------------------------------
// 该checkbox用于控制是否隐藏，所以逻辑和普通checkbox相反，正是反，反是正
// -------------------------------
export default {
  model: {
    prop: 'hide',
    event: 'change'
  },
  props: {
    hide: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleChange(evt) {
      this.$emit('change', evt.target.checked === false ? true : false);
    }
  },
  render() {
    return (
      <label class="chem-grid_base-checkbox">
        <input type="checkbox" checked={this.hide === false} onChange={this.handleChange} />
        <div class="chem_base-checkout_inner"></div>
      </label>
    );
  }
};
