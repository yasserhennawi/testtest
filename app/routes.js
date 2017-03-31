// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

import values from 'lodash/values';
import keys from 'lodash/keys';

import {
  loadReducers as loadAppReducers,
  loadSagas as loadAppSagas,
} from 'pages/App/dependencies';
import {
  loadReducers as loadHomePageReducers,
  loadSagas as loadHomePageSagas,
} from 'pages/HomePage/dependencies';
import {
  loadReducers as loadBalancePageReducers,
  loadSagas as loadBalancePageSagas,
} from 'pages/BalancePage/dependencies';
import {
  loadReducers as loadNotFoundPageReducers,
  loadSagas as loadNotFoundPageSagas,
} from 'pages/NotFoundPage/dependencies';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export const createRenderWithDependencies = (store) => (componentPromise, loadReducers, loadSagas, cb) => {
  importReducersAndSagas(store, loadReducers, loadSagas)
    .then(() => componentPromise)
    .then((component) => loadModule(cb)(component))
    .catch(errorLoading);
};

const importReducersAndSagas = (store, loadReducers, loadSagas) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  const reducersPromises = loadReducers();
  const sagasPromises = loadSagas();

  return Promise.all([
    ...values(reducersPromises),
    ...sagasPromises,
  ]).then((rest) => {
    keys(reducersPromises).forEach((reducerKey) => {
      injectReducer(reducerKey, rest.shift().default);
    });
    rest.forEach((sagas) => injectSagas(sagas.default));
  });
};

export const createFrontendRoutes = (store) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  const renderPage = createRenderWithDependencies(store);

  importReducersAndSagas(store, loadAppReducers, loadAppSagas);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        renderPage(
          System.import('pages/HomePage'),
          loadHomePageReducers,
          loadHomePageSagas,
          cb
        );
      },
    },
    {
      path: '/balance',
      name: 'balance',
      getComponent(nextState, cb) {
        renderPage(
          System.import('pages/BalancePage'),
          loadBalancePageReducers,
          loadBalancePageSagas,
          cb
        );
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        renderPage(
          System.import('pages/NotFoundPage'),
          loadNotFoundPageReducers,
          loadNotFoundPageSagas,
          cb
        );
      },
    },
  ];
};
