import Vue from 'vue';
import '../styles/renderCustomizePanel.scss';
import { deepClone } from '../utils';

import BaseCheckbox from '../component/BaseCheckbox';

const HEIGHT = 22;

const panel = {
  inject: ['Provider'],
  components: { BaseCheckbox },
  data() {
    return {
      columnList: deepClone(this.Provider.panelColumns),
      state: {
        dragging: false,
        draggingIndex: -1,
        startPageY: 0,
        offsetPageY: 0
      }
    };
  },
  computed: {
    parentColumnListConfig() {
      return this.Provider.panelColumns;
    }
  },
  watch: {
    'Provider.panelColumns': {
      handler: function(newArr) {
        if (JSON.stringify(newArr) === JSON.stringify(this.columnList)) return;
        this.columnList = deepClone(newArr);
      },
      deep: true
    },
    columnList: {
      handler: function(newList) {
        this.Provider.panelColumns = deepClone(newList);
      },
      deep: true
    }
  },
  methods: {
    move(arr, startIndex, toIndex) {
      const _arr = deepClone(arr);
      _arr.splice(toIndex, 0, _arr.splice(startIndex, 1)[0]);
      this.params.columnApi.moveColumnByIndex(startIndex, toIndex);
      return _arr;
    },
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
        this.columnList = this.move(this.columnList, _draggingIndex, _draggingIndex + 1);
        this.state.draggingIndex = _draggingIndex + 1;
        this.state.startPageY += HEIGHT;
      } else if (_offset < -HEIGHT && _draggingIndex > 0) {
        _offset += HEIGHT;
        this.columnList = this.move(this.columnList, _draggingIndex, _draggingIndex - 1);
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
    },
    handleClose() {
      this.params.api.closeToolPanel();
    },
    handleReset() {
      this.Provider.resetColumnsConfig();
    },
    checkboxStateChange(field, isHide) {
      this.params.columnApi.setColumnVisible(field, !isHide);
    }
  },
  render() {
    return (
      <div class="customize_drag_content">
        <div class="customize_drag__content-list">
          <ul onMousedown={this.handleMouseDown}>
            {this.columnList.map((column, idx) => {
              return (
                <li key={column.field} style={this.getDraggingStyle(idx)}>
                  <base-checkbox
                    vModel={column.hide}
                    onChange={this.checkboxStateChange.bind(null, column.colId)}
                  ></base-checkbox>
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
          <div class="button" onClick={this.handleReset}>
            恢复默认
          </div>
          <div class="button" onClick={this.handleClose}>
            关闭
          </div>
        </div>
      </div>
    );
  }
};

export default Vue.extend(panel);
