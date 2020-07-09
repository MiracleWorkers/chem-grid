import Vue from 'vue';
import '../styles/renderHandleButtons.scss';
import { isFunction } from '../utils';

let buttonList = [];

const handle = {
  inject: ['Provider'],
  methods: {
    handleClick(btn, rowIndex) {
      btn.click && btn.click.call(null, this.params.data, rowIndex);
    },
    renderButton(config) {
      const authObj = this.Provider.auth;
      let hasAuth, isRender;
      if (isFunction(config.show)) {
        isRender = config.show();
      } else {
        isRender = config.show !== false;
      }

      hasAuth = authObj ? (authObj.buttons || []).indexOf(config.auth) !== -1 : true;

      return isRender && hasAuth ? (
        <button onClick={this.handleClick.bind(this, config)} disabled={config.disabled}>
          {config.label}
        </button>
      ) : null;
    }
  },
  render() {
    const { rowPinned } = this.params.node;
    return (
      <div class="chem-grid_handleButtons">
        {buttonList.map(btn => {
          return rowPinned ? <span>{this.params.value}</span> : this.renderButton(btn);
        })}
      </div>
    );
  }
};

export default function(buttonsConfig = []) {
  buttonList = buttonsConfig;
  return Vue.extend(handle);
}
