const isArray = target => Object.prototype.toString.call(target) === '[object Array]';
const isFunction = target => Object.prototype.toString.call(target) === '[object Function]';
const isObject = target => Object.prototype.toString.call(target) === '[object Object]';
const filterObjectNull = obj => {
  if (!isObject(obj)) {
    console.error('您传递的参数不为Object');
    return;
  }
  const _filterAfter = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined && obj[key]) {
      _filterAfter[key] = obj[key];
    }
  }
  return _filterAfter;
};
const debounce = (func, wait = 500, immediate = false) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  };
};

const deepClone = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const _clone = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      _clone[key] = deepClone(obj[key]);
    }
  }
  return _clone;
};

// 切换数组两个元素的位置
const swapArrElement = (arr, startIndex, toIndex) => {
  const _arr = deepClone(arr);
  _arr.splice(toIndex, 0, _arr.splice(startIndex, 1)[0]);
  return _arr;
};

const setLocalStorage = (field, value) => {
  window.localStorage.setItem(field.toUpperCase(), JSON.stringify(value));
};

const getLocalStorage = field => {
  const result = window.localStorage.getItem(field.toUpperCase());
  return JSON.parse(result);
};

const removeLocalStorage = field => {
  window.localStorage.removeItem(field.toUpperCase());
};

const getFucParamsList = func => {
  if (typeof func !== 'function') [];
  var params = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func));
  if (params[1]) {
    var args = params[1].replace(/[^,\w]*/g, '').split(',');
    return args;
  } else {
    return [];
  }
};

export {
  isArray,
  isFunction,
  isObject,
  filterObjectNull,
  debounce,
  deepClone,
  swapArrElement,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  getFucParamsList
};
