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
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined) {
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
export { isArray, isFunction, isObject, filterObjectNull, debounce };
