<template>
  <label class="chem_base-checkbox">
    <input type="checkbox" :checked="checked" @change="this.handleChange" />
    <div class="chem_base-checkout_inner"></div>
  </label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(evt) {
      this.$emit('change', evt.target.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/var.scss';
.chem_base-checkbox {
  display: inline-block;
  vertical-align: middle;
  input[type='checkbox'] {
    display: none;
  }

  .chem_base-checkout_inner {
    position: relative;
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid #333;
    transition: all ease-in-out 250ms;
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
    background-color: $THEME_COLOR;
    border-color: $THEME_COLOR;
    &:after {
      opacity: 1;
    }
  }
}
</style>
