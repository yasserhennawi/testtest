import { fromJS } from 'immutable';
import {
  FETCH_BALANCE_BY_IBAN,
  FETCH_BALANCE_BY_IBAN_SUCCESS,
  FETCH_BALANCE_BY_IBAN_FAILURE,
} from './constants';

const balanceInitialState = fromJS({
  status: {
    isLoading: false,
    success: false,
    error: null,
  },
  balance: {
    account: {
      name: '',
      iban: '',
      balance: '',
    },
    currency: '',
    debitsAndCredits: [],
  }
});

export default (state = balanceInitialState, action) => {
  switch (action.type) {
    case FETCH_BALANCE_BY_IBAN:
      return state.mergeIn(['status'], {
        isLoading: true,
        success: false,
        error: null,
      })
      .setIn(['balance', 'account', 'iban'], action.iban);

    case FETCH_BALANCE_BY_IBAN_SUCCESS:
      return state.mergeIn(['status'], {
        isLoading: false,
        success: true,
      })
      .set('balance', fromJS(action.balance));

    case FETCH_BALANCE_BY_IBAN_FAILURE:
      return state.mergeIn(['status'], {
        isLoading: false,
        error: action.error,
      });

    default:
      return state;
  }
};
