<template>
  <label class="chem-grid_base-checkbox">
    <input type="checkbox" :checked="hide === false" @change="this.handleChange" />
    <div class="chem_base-checkout_inner"></div>
  </label>
</template>

<script>
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
  }
};
</script>

<style lang="scss">
.chem-grid_base-checkbox {
  display: inline-block;
  vertical-align: middle;
  input[type='checkbox'] {
    display: none;
  }
  color: #0091ea;

  .chem_base-checkout_inner {
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid #333;
    transition: all ease-in-out 250ms;
    cursor: pointer;
    &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%) rotate(45deg);
      content: '';
      display: block;
      width: 4px;
      height: 8px;
      border-width: 0;
      border-color: #fff;
      border-style: solid;
      border-bottom-width: 2px;
      border-right-width: 2px;
      opacity: 0;
      transition: opacity ease 250ms;
    }
  }

  input[type='checkbox']:checked + .chem_base-checkout_inner {
    background-color: currentColor;
    border-color: currentColor;
    &:after {
      opacity: 1;
    }
  }
}
</style>
