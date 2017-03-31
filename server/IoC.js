import * as Q from 'q';

export default class IoC {
  static same(newName, oldName) {
    if (oldName in IoCC.resolved) {
      IoCC.resolved[newName] = IoCC.resolved[oldName];
    }
    if (oldName in IoCC.callables) {
      IoCC.callables[newName] = IoCC.callables[oldName];
    }
    if (oldName in IoCC.singletons) {
      IoCC.singletons[newName] = IoCC.singletons[oldName];
    }
    if (oldName in IoCC.instances) {
      IoCC.instances[newName] = IoCC.instances[oldName];
    }
  }

  static singleton(name, dependencies, classType) {
    if (! classType) {
      throw new Error(`You are trying to register an undefined singleton: ${name}`);
    }
    IoCC.singletons[name] = {
      dependencies,
      classType,
    };
  }

  static callable(name, dependencies, func) {
    if (typeof func !== 'function') {
      throw new Error(`You are trying to register a non callable: ${name}`);
    }
    IoCC.callables[name] = {
      dependencies,
      func,
    };
  }

  static callableMany(callables) {
    callables.forEach(
      ([ name, dependencies, func ]) => IoCC.callable(name, dependencies, func));
  }

  static instance(name, dependencies, classType) {
    if (! classType) {
      throw new Error(`You are trying to register an undefined instance: ${name}`);
    }
    IoCC.instances[name] = {
      dependencies,
      classType,
    };
  }

  static value(name, value) {
    IoCC.resolved[name] = value;
  }

  static async resolveDependencies(dependencies, dependencyResolver) {
    const resolveDependencies = [];
    for(let dependency of dependencies) {
      resolveDependencies.push(IoC.resolveDependency(dependency, dependencyResolver));
    }
    return await Q.all(resolveDependencies);
  }

  static async resolveCallable(name, ...args) {
    const callable = IoCC.callables[name];

    const newArgs = await IoC.resolveDependencies(callable.dependencies, name);

    return await callable.func.call(callable.func, ...args, ...newArgs);
  }

  static async resolveClassInstance(name, ...args) {
    const instance = IoCC.singletons[name];

    const newArgs = await IoC.resolveDependencies(instance.dependencies, name);

    return new instance.classType(...args, ...newArgs);
  }

  static async resolveRegex(regex) {
    const toResolve = [];
    for(let key in IoCC.callables) {
      if (regex.exec(key)) {
        toResolve.push(key);
      }
    }
    return Q.all(toResolve.map(r => IoC.resolve(r)));
  }

  static listen(name, callback) {
    IoCC.listeners.push({
      name,
      callback
    });
  }

  static callListeners(name, typeOfResolve, dependencyResolver) {
    IoCC.listeners
      .filter(listener => listener.name === name)
      .forEach(listener => listener.callback({ typeOfResolve, dependencyResolver }));
  }

  static resolveDependency(name, dependencyResolver) {
    IoC.callListeners(name, 'dependency', dependencyResolver);
    return IoC.resolveName(name);
  }

  static onlyResolve(names) {
    IoCC.onlyResolveNames = names;
    console.log('onlyResolve', IoCC.onlyResolveNames);
  }

  static async resolve(name, ...args) {
    IoC.callListeners(name, 'direct', null);
    return IoC.resolveName(name, ...args);
  }

  static async resolveName(name, ...args) {

    try {
      if (IoCC.onlyResolveNames.length > 0 && IoCC.onlyResolveNames.indexOf(name) < 0) {
        // Return undefined
        return;
      }
      // @TODO add timeout logic for circular dependency
      if (!(name in IoCC.resolved)) {

        if (name in IoCC.callables) {
          IoCC.resolved[name] = IoC.resolveCallable(name, ...args);
        }

        else if (name in IoCC.singletons) {
          // Resolve and save so we use the same instance again
          IoCC.resolved[name] = IoC.resolveClassInstance(name, ...args);
        }

        else if (name in IoCC.instances) {
          // Dont save, everytime you will create a new instance
          return await IoC.resolveClassInstance(name, ...args);
        }

        else {
          throw new Error(`Cant resolve ${name}: Not Registered`);
        }
      }

      return await IoCC.resolved[name];
    } catch(error) {
      console.log(`Error while resolving ${name}:`);
      return Q.reject(error);
    }
  }
}

let IoCC = {
  listeners: [],
  onlyResolveNames: [],
  callables: {},
  singletons: {},
  instances: {},
  resolved: {},
};
