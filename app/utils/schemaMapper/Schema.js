import { fromJS, Iterable } from 'immutable';
import { DEFAULT_LOCALE } from 'modules/locale/constants';

export default class Schema {
  constructor(schemaObj, currentLocale) {
    if (schemaObj) {
      this.strct = schemaObj;
      this.locale = currentLocale;
    } else {
      throw new Error('schema must be of type object or string and not empty');
    }
  }

  map = (dataSource) => {
    if (dataSource && Iterable.isIterable(dataSource)) {
      const result = this.getValueByPath(dataSource, this.strct);
      return fromJS(result);
    }

    throw new Error('data source must be Iterable object');
  }

  getValueByPath = (object, path) => {
    if (typeof path === 'string') {
      return object.getIn(parseString(path));
    } else if (typeof path === 'object') {
      if (path.$path) {
        return (typeof path.$cb === 'function') ? path.$cb(this.handleFilters(object, path)) : this.handleFilters(object, path);
      }

      const result = {};
      Object.keys(path).forEach((key) => {
        result[key] = this.getValueByPath(object, path[key]);
      });
      return result;
    }

    return null;
  }

  handleFilters = (object, { $path, $filter }) => {
    if ($filter === 'locale') {
      return parseLocal(object, $path, this.locale, DEFAULT_LOCALE);
    }
    if ($filter === 'mainImage') {
      return findMainImage(getObjectByPath(object, $path) || fromJS([]));
    }
    if ($filter && $filter.indexOf('imageKind') > -1) {
      return findImageKind(getObjectByPath(object, $path) || fromJS([]), $filter.replace('imageKind=', ''));
    }
    return getObjectByPath(object, $path);
  }
}

const getObjectByPath = (object, path) => object.getIn(path.split('.'));

const findImageKind = (images, kind) => images.find((image) => image.get('kind') === kind);
// @todo when we figure out kind and isMain
const findMainImage = (images) => images.find((image) => !!image.get('isMain')) || images.get(0);

function parseLocal(object, path, locale, defaultLocal) {
  const parsed = (/(.*i18n)\.(.*)/g).exec(path);
  const pathToI18n = parsed[1];
  const pathToValue = parsed[2];
  const i18n = object.getIn(pathToI18n.split('.'));
  if (i18n) {
    if (i18n.size === 1) {
      return pathToValue ? i18n.first().getIn(pathToValue.split('.')) : i18n.first();
    }
    let localizedI18n = i18n.find((i) => {
      if (typeof i.locale === 'object') {
        return i.getIn(['locale', 'type']) === locale;
      }
      return i.get('locale') === locale;
    });
    if (!localizedI18n) {
      localizedI18n = i18n.find((i) => {
        if (typeof i.locale === 'object') {
          return i.getIn(['locale', 'type']) === defaultLocal;
        }
        return i.get('locale') === defaultLocal;
      });
    }
    if (localizedI18n) {
      return pathToValue ? localizedI18n.getIn(pathToValue.split('.')) : localizedI18n;
    }
  }
  return null;
}

function parseString(string) {
  return string.split('.');
}
