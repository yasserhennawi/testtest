export const sortType = {
  ASC: 'ascending',
  DSC: 'descending',
  DEFAULT: 'default',
};

const sort = (items, type, func) => {
  switch (type) {
    case sortType.ASC:
      return items.sort(func);
    case sortType.DSC:
      items.sort(func);
      return items.reverse();
    default:
      return items;
  }
};

const number = (key) => (a, b) => a[key] - b[key];

const string = (key) => (a, b) => {
  const A = a[key].toLowerCase();
  const B = b[key].toLowerCase();
  if (A < B) {
    return -1;
  } else if (A > B) {
    return 1;
  }
  return 0;
};

const date = (key) => (a, b) => new Date(a[key]) - new Date(b[key]);

export const sortNumber = (items, key, type) => sort(items, type, number(key));

export const sortString = (items, key, type) => sort(items, type, string(key));

export const sortDate = (items, key, type) => sort(items, type, date(key));

export const isDefault = (key, type) => !key || type === sortType.DEFAULT;
