import Vue from 'vue';
import '../styles/renderCustomizePanel.scss';
import { deepClone } from '../utils';

import BaseCheckbox from '../component/BaseCheckbox.vue';

const HEIGHT = 22;

const move = (arr, startIndex, toIndex) => {
  const _arr = deepClone(arr);
  _arr.splice(toIndex, 0, _arr.splice(startIndex, 1)[0]);
  return _arr;
};

const panel = {
  inject: ['Provider'],
  components: { BaseCheckbox },
  data() {
    return {
      flag: true,
      columnList: this.Provider.columnList,
      state: {
        dragging: false,
        draggingIndex: -1,
        startPageY: 0,
        offsetPageY: 0
      }
    };
  },
  methods: {
    handleMouseDown(evt) {
      const {
        target: { dataset, tagName }
      } = evt;
      if (tagName === 'SPAN' && dataset.index !== undefined) {
        this.state.dragging = true;
        this.state.draggingIndex = +dataset.index;
        this.state.startPageY = evt.pageY;
      }
    },
    handleMouseUp() {
      this.state.dragging = false;
      this.state.draggingIndex = -1;
      this.state.startPageY = 0;
    },
    handleMouseMove(evt) {
      let _offset = evt.pageY - this.state.startPageY;
      const _draggingIndex = this.state.draggingIndex;
      if (_offset > HEIGHT && _draggingIndex < this.columnList.length - 1) {
        _offset -= HEIGHT;
        this.columnList = move(this.columnList, _draggingIndex, _draggingIndex + 1);
        this.state.draggingIndex = _draggingIndex + 1;
        this.state.startPageY += HEIGHT;
      } else if (_offset < -HEIGHT && _draggingIndex > 0) {
        _offset += HEIGHT;
        this.columnList = move(this.columnList, _draggingIndex, _draggingIndex - 1);
        this.state.draggingIndex = _draggingIndex - 1;
        this.state.startPageY -= HEIGHT;
      }
      this.state.offsetPageY = _offset;
    },
    getDraggingStyle(index) {
      let activeStyle = {};
      if (this.state.draggingIndex === index) {
        activeStyle = {
          backgroundColor: '#eee',
          transform: `translate(5px, ${this.state.offsetPageY}px)`,
          opacity: 0.6,
          fontWeight: 600
        };
      }

      return { ...activeStyle, height: HEIGHT + 'px' };
    }
  },
  render() {
    // Sticky Footer
    return (
      <div class="customize_drag_content">
        <div class="customize_drag__content-list">
          <ul onMousedown={this.handleMouseDown}>
            {this.columnList.map((column, idx) => {
              return (
                <li key={column.field} style={this.getDraggingStyle(idx)}>
                  <base-checkbox vModel={this.flag}></base-checkbox>
                  <span class="ag-icon ag-icon-grip" data-index={idx}></span>
                  <span class="drag_title">{column.headerName}</span>
                </li>
              );
            })}
            {this.state.dragging && (
              <div
                class="customize_drag_content-mask"
                onMouseup={this.handleMouseUp}
                onMousemove={this.handleMouseMove}
                onMouseleave={this.handleMouseUp}
              ></div>
            )}
          </ul>
        </div>
        <div class="customize_drag_content-buttons">
          <button>重置</button>
        </div>
      </div>
    );
  }
};

export default Vue.extend(panel);
