const path = require("path");
const fs = require("fs");
const nodeGlob = require("glob");
const Q = require('q');
const COMPONENTS_GLOB = "app/{modules/**/components,pages,features}/**/index.js";
const _ = require('lodash');

const basePath = process.cwd();

const glob = (pattern) => new Promise((resolve, reject) => {
  nodeGlob(pattern, (error, value) => (error ? reject(error) : resolve(value)));
});

const readFile = (fileName) => new Promise((resolve, reject) => {
  fs.readFile(fileName, (error, value) => (error ? reject(error) : resolve(value.toString())));
});

const writeFile = (fileName, data) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, data, (error, value) => (error ? reject(error) : resolve(value)));
});

// options is optional 
glob(path.join(basePath, COMPONENTS_GLOB)).then((files) => {
  return Q.all(files.map(fileName => readFile(fileName).then(data => ({
    data,
    fileName
  }))));
})
.then(result => {

  const promises = result.map(({ data, fileName }) => {

    ///////////////////////////////////////
    /// Current file module and component
    ///////////////////////////////////////
    const result = /modules\/([A-Za-z]+)\/components\/([A-Za-z]+)/g.exec(fileName);
    let module, component;
    if(result) {
      module = result[1];
      component = result[2];
    }
    // Not a module then probably a page or feature
    else {
      const result = /app\/([A-Za-z]+)\/([A-Za-z]+)\/([A-Za-z]+)/g.exec(fileName);
      module = result[1];
      component = result[2];
    }
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    const regex = /from\s['"](modules\/([A-Za-z]+)\/components|..)\/([A-Za-z]+)/g;
    let m;
    const dependencies = [];
    while ((m = regex.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      dependencies.push({ module: m[2] || module, component: m[3] });
    }

    return {
      fileName,
      module,
      component,
      dependencies: _.uniqBy(dependencies, 'component'),
    };
  }).map(({ fileName, module, component, dependencies }) => {
    const directory = path.dirname(fileName);



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// The output file ............
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
    const outputData = `${dependencies.map(importDependency).join("\n")}

export const loadReducers = () => ({
${reducerExists(directory) ? `  ${component}: ${importReducer(module, component).concat(",\n")}` : ''}
${dependencies.length > 0 ? '  ' + dependencies.map(runDependencyReducers).join(",\n  ").trim().concat(",") : ''}
});

export const loadSagas = () => [
${sagasExists(directory) ? '  ' + importSagas(module, component).concat(",\n") : ''}
${dependencies.length > 0 ? '  ' + dependencies.map(runDependencySagas).join(",\n  ").trim().concat(",") : ''}
];
`;
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////



    return { outputData, fileName };
  }).map(({ fileName, outputData }) => {
    return writeFile(path.join(path.dirname(fileName), "dependencies.js"), outputData);
  });

  return Q.all(promises);
})
.then(() => {
  console.log("Generated all dependencies successfully!");
}, err => console.log(err));

const sagasExists = directory => fs.existsSync(path.join(directory, "sagas.js"));
const reducerExists = directory => fs.existsSync(path.join(directory, "reducer.js"));
const getImportPath = (module, component) => (module === 'pages' || module === 'features')
  ? `${module}/${component}` : `modules/${module}/components/${component}`
const importReducer = (module, component) => `System.import('${getImportPath(module, component)}/reducer')`;
const importSagas = (module, component) => `System.import('${getImportPath(module, component)}/sagas')`;
const importDependency = dependency => `import {
  loadReducers as load${dependency.component}Reducers,
  loadSagas as load${dependency.component}Sagas,
} from 'modules/${dependency.module}/components/${dependency.component}/dependencies';`;
const runDependencyReducers = dependency => `...load${dependency.component}Reducers()`;
const runDependencySagas = dependency => `...load${dependency.component}Sagas()`;