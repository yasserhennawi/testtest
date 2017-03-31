import IoC from 'server/IoC';
import { Router } from 'express';

export const balanceRouter = (balanceController) => {
  const balanceRouter = Router();

  // Get balance by iban
  balanceRouter.get('/:iban', balanceController.findByIban.bind(balanceController));

  return balanceRouter;
}

IoC.callable('balanceRouter', ['balanceController'], balanceRouter);
