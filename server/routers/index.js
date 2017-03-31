import IoC from 'server/IoC';
import { Router } from 'express';

export const apiRouter = (balanceRouter) => {
  let router = Router();

  // Use balance routers
  router.use('/balance', balanceRouter);

  return router;
}

IoC.callable('apiRouter', [
  'balanceRouter',
], apiRouter);
