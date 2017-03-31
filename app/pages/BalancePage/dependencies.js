

export const loadReducers = () => ({
  BalancePage: System.import('pages/BalancePage/reducer'),


});

export const loadSagas = () => [
  System.import('pages/BalancePage/sagas'),


];
