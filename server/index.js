import IoC from 'server/IoC';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as Q from 'q';
import * as _ from 'lodash';
import * as path from 'path';
import * as glob from 'glob';

const express = require('express');
const fs = require('fs');
const cors = require('cors');

const argv = require('minimist')(process.argv.slice(2));
const isDev = process.env.NODE_ENV !== 'production';
const setup = require('./middlewares/frontend-middleware');
const resolve = require('path').resolve;
const dotenv = require('dotenv');

if (fs.existsSync(resolve(process.cwd(), '.env'))) {
  dotenv.config();
}

const host = '0.0.0.0';
const port = argv.port || process.env.PORT || 8080;

// Require all files to register themselves
glob.sync(path.join(__dirname,
  './@(controllers|middlewares|routers)/**/*.js'
  )).forEach((file) => {
  require(path.resolve(file));
});

const addAPIRouters = async (app) => {
  const apiRouter = await IoC.resolve('apiRouter');

  // Use APIs router
  app.use('/api/v1', apiRouter);
}

const addErrorMiddleware = async (app) => {
  const errorMiddleware = await IoC.resolve('errorMiddleware');

  // Use Error middleware
  app.use(errorMiddleware.logErrors.bind(errorMiddleware));
  app.use(errorMiddleware.response.bind(errorMiddleware));

  app.use((req, res, next) => {
    res.send({ statusCode: 404, result: 'Not Found' });
  });
}

const configureExpressApp = async (app) => {
  app.use(bodyParser.json());
  app.use(cors());

  return app;
}

const runServer = async () => {
  const app = express();

  // Configure Express app
  await configureExpressApp(app);

  // Configure app routers
  await addAPIRouters(app);

  // Any shared configuration for production and dev
  setup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/',
  });
  
  await addErrorMiddleware(app);
  
  const server = http.createServer(app);

  // Start your app.
  server.listen(port, host, async (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Server listening on: http://localhost:%s', port);
    }

  });
};

runServer();
