import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

export const selectBalancePageDomain = () => (state) => state.get('BalancePage');

export const selectBalanceStatus = () => createSelector(
  selectBalancePageDomain(),
  (state) => state.get('status')
);

export const selectBalance = () => createSelector(
  selectBalancePageDomain(),
  (state) => state.get('balance')
);

export const selectBalanceAccountInfo = () => createSelector(
  selectBalance(),
  (balance) => balance.get('account')
);

export const selectBalanceCurrency = () => createSelector(
  selectBalance(),
  (balance) => balance.get('currency')
);

export const selectBalanceDebitsAndCredits = () => createSelector(
  selectBalance(),
  (balance) => balance.get('debitsAndCredits')
);

const selectBalancePage = () => createSelector(
  selectBalanceStatus(),
  selectBalanceAccountInfo(),
  selectBalanceCurrency(),
  selectBalanceDebitsAndCredits(),
  (status, info, currency, debitsAndCredits) => {
    return {
      status: status.toJS(),
      info: info.toJS(),
      currency,
      debitsAndCredits: debitsAndCredits.toJS(),
    }
  }
);

export default selectBalancePage;
