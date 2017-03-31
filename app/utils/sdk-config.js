const config = {
  host: '',
  version: 'v1',
  storageType: 'localStorage',
  drive: {
    bucket: '',
    endpoint: '',
  },
};

export default {
  get: (key) => config[key],
  set: (key, value) => {
    if (config[key]) {
      config[key] = value;
      return true;
    }
    return false;
  },
  init: (_config) => {
    if (_config) {
      Object.assign(config, _config);
      return true;
    }
    return false;
  },
};

export const getEndpoint = () => config.host;

export const getVersion = () => config.version;
