import adapters from './adapters';

export default class dataStorageManager {
  constructor(storageType) {
    if (!adapters[storageType]) {
      throw new Error(`unSupported storage manager named: ${storageType}`);
    }
    this.storage = new adapters[storageType]();
  }

  set(value, name = 'unknown') {
    return this.storage.set(value, name);
  }

  get(name = 'unknown') {
    return this.storage.get(name);
  }

  remove(name = 'unknown') {
    return this.storage.remove(name);
  }
}
