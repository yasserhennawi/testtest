import { DEFAULT_ALL_LOCALES } from 'modules/locale/constants';
import { find, findIndex } from 'lodash';

export const findI18n = (i18nArray, locale, getAny = false) => {
  if (!i18nArray || i18nArray.constructor !== Array) {
    return {};
  }

  const localeObj = find(i18nArray, ['locale', locale]);

  if (!localeObj && getAny) {
    return i18nArray[0] || {};
  }

  return localeObj || {};
};

export const getIndexByLocale = (i18nArray, locale) => findIndex(i18nArray, ['locale', locale]);

export const initI18nStrings = (keys = [], locales = DEFAULT_ALL_LOCALES) => {
  const i18nArr = [];

  locales.forEach((locale) => {
    const i18n = {};

    keys.forEach((k) => {
      switch (k.type) {
        case 'object':
          i18n[k.key] = {};
          break;
        case 'string':
          i18n[k.key] = '';
          break;
        case 'number':
          i18n[k.key] = 0;
          break;
        case 'date':
          i18n[k.key] = new Date();
          break;
        default:
          break;
      }
    });

    i18n.locale = locale;
    i18nArr.push(i18n);
  });

  return i18nArr;
};
