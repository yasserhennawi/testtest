import { normalize } from 'normalizr';
import * as Q from 'q';
import config, { getEndpoint, getVersion } from 'utils/sdk-config';
import browserRequest from 'browser-request';
import ApiError from './error';
import Store from '../dataStorageManager';

let hooks = [];

const getHookIndexByNameAndType = (name, type) => {
  for (let i = hooks.length - 1; i >= 0; i -= 1) {
    if (hooks[i].name === name && hooks[i].type === type) {
      return i;
    }
  }
  return -1;
};

const getHookByNameAndType = (name, type) => hooks[getHookIndexByNameAndType(name, type)];

const getHeaderHooks = () => hooks.filter((hook) => hook.type === 'header');
const getParameterHooks = () => hooks.filter((hook) => hook.type === 'parameter');

const addHook = (name, value, type) => {
  let method;
  if (typeof value !== 'function') {
    method = () => value;
  } else {
    method = value;
  }

  const hook = getHookByNameAndType(name, type);

  if (hook) {
    hook.method = method;
  } else {
    hooks.push({
      name,
      method,
      type,
    });
  }
};

const removeHookIndex = (index) => {
  hooks = [...hooks.slice(0, index), ...hooks.slice(index + 1)];
};

const removeHook = (name, type) => {
  const index = getHookIndexByNameAndType(name, type);

  if (index > -1) {
    removeHookIndex(index);
  }
};

function setTokenHeader(headers) {
  const newheaders = Object.assign({}, headers);
  const localStorage = new Store(config.get('storageType'));
  const token = localStorage.get('token');
  if (token) {
    newheaders.Authorization = `JWT ${token}`;
  }
  return newheaders;
}

/**
 * Hook header variable for each request
 * @param  {string} name
 * @param  {string|function} method
 * @return {void}
 */
export function hookHeader(name, method) {
  addHook(name, method, 'header');
}

/**
 * Hook query or body parameter variable for each request
 * @param  {string} name
 * @param  {string|function} method
 * @return {void}
 */
export function hookParameter(name, method) {
  addHook(name, method, 'parameter');
}

export function setAccessToken(token) {
  const localStorage = new Store(config.get('storageType'));
  localStorage.set(token, 'token');
  return true;
}

export function removeToken() {
  const localStorage = new Store(config.get('storageType'));
  localStorage.remove('token');
  localStorage.remove('isGuest');
  return true;
}

export function getAccessToken() {
  const localStorage = new Store(config.get('storageType'));
  const token = localStorage.get('token');
  return token;
}

export function unhookHeader(name) {
  removeHook(name, 'header');
}

export function unhookParameter(name) {
  removeHook(name, 'parameter');
}

export function callExternal(uri) {
  const deferred = Q.defer();

  const options = {
    url: uri,
    json: true,
    headers: {},
  };

  browserRequest(options, (err, response, body) => {
    if (err) {
      deferred.reject(new ApiError(err));
    } else if (body.error) {
      deferred.reject(new ApiError(body));
    } else {
      deferred.resolve(body);
    }
  });

  return deferred.promise;
}

export function call({ method, qs, uri, data, schema, useToken = true }) {
  const deferred = Q.defer();

  const options = {
    method: method.toUpperCase(),
    url: getFullUrl(uri),
    json: true,
    body: data || {},
    qs: qs || {},
    headers: {},
  };

  const addParameter = (parameter, value) => {
    if (method.toUpperCase() === 'GET') {
      options.qs[parameter] = value;
    } else {
      options.body[parameter] = value;
    }
  };

  if (useToken) {
    // add token to the header
    // TODO: to be removed to an auth middleware
    options.headers = setTokenHeader(options.headers);
  }

  // Add dynamically hooked headers
  for (const headerHook of getHeaderHooks()) { // eslint-disable-line no-restricted-syntax
    if (headerHook.method()) {
      options.headers[headerHook.name] = headerHook.method();
    }
  }

  // Add dynamically hooked parameters
  for (const parameterHook of getParameterHooks()) { // eslint-disable-line no-restricted-syntax
    if (parameterHook.method()) {
      addParameter(parameterHook.name, parameterHook.method());
    }
  }

  // Stringify body (required by the browserRequest library)
  // @todo change to superagent library and explicitly define it here
  options.body = JSON.stringify(options.body);

  browserRequest(options, (err, response, body) => {
    if (err) {
      deferred.reject(new ApiError(err));
    } else if (body.error) {
      deferred.reject(new ApiError(body));
    } else if (body.result && schema) {
      const _res = Object.assign({}, body); // eslint-disable-line no-underscore-dangle
      const normalized = normalizeResponse(body.result, schema);
      normalized._res = _res; // eslint-disable-line no-underscore-dangle
      deferred.resolve(normalized);
    } else {
      deferred.resolve(body);
    }
  });
  deferred.promise.catch(({ err }) => {
    if (err.statusCode === 401) {
      removeToken();
    }
    return err;
  });

  return deferred.promise;
}

export function getFullUrl(uri) {
  return getEndpoint().concat(`/api/${getVersion()}/${uri.replace(/^\/+/g, '')}`);
}

export function redirectTo(uri) {
  window.location.href = getFullUrl(uri);
}

function formatResult(result) {
  return {
    ...result,
    // Make sure the id is string
    _id: String(result._id), // eslint-disable-line no-underscore-dangle
    id: String(result._id), // eslint-disable-line no-underscore-dangle
  };
}

function normalizeResponse(result, schema) {
  let schemaAttribute = schema;
  let newResult;
  if (result.constructor === Array) {
    newResult = result.map(formatResult);
    schemaAttribute = [schema];
  } else {
    newResult = formatResult(result);
  }

  return normalize(newResult, schemaAttribute);
}
