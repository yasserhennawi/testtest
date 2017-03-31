export const isEmptyObj = (obj) => (Object.keys(obj).length === 0 && obj.constructor === Object);

export const getParameterByName = (name, url = window.location.href) => {
  const n = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
  const regex = new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const isEmail = (text) => {
  const r = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/; // eslint-disable-line no-useless-escape
  return r.test(text);
};

export const cloneObject = (obj) => Object.assign({}, {}, obj);

/**
 * Helper to remove object from array without mutating
 * @param  {Array} arr
 * @param  {Number} i
 * @return {Array}
 */
export const removeIndex = (arr, i) => [
  ...arr.slice(0, i),
  ...arr.slice(i + 1),
];

/**
 * Replace index with the new data
 * @param  {Array} arr
 * @param  {Number} i
 * @param  {any} data
 * @return {Array}
 */
export const replaceIndex = (arr, i, data) => [
  ...arr.slice(0, i),
  data,
  ...arr.slice(i + 1),
];

/**
 * Merge data in the position
 * @param  {Array} arr
 * @param  {Number} i
 * @param  {Object|Array} data
 * @return {Array}
 */
export const mergeIndex = (arr, i, data) => replaceIndex(arr, i, merge(arr[i], data));

/**
 * Helper to merge either two arrays or two objects
 * @param  {Array|Object} data1
 * @param  {Array|Object} data2
 * @return {Array|Object}
 */
export const merge = (data1, data2) => {
  // Check type matches
  if (typeof data1 !== typeof data2 || isArray(data1) !== isArray(data2)) {
    throw new Error('Type doesnt match');
  }

  if (isArray(data1)) {
    return [...data1, ...data2];
  }

  if (isObject(data1)) {
    return { ...data1, ...data2 };
  }

  throw new Error('This data type cannt be merged');
};

export const isArray = (arr) => arr.constructor === Array;
export const isObject = (obj) => typeof obj === 'object' && !isArray(obj);
