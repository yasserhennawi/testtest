import {
  FETCH_BALANCE_BY_IBAN,
  FETCH_BALANCE_BY_IBAN_SUCCESS,
  FETCH_BALANCE_BY_IBAN_FAILURE,
} from './constants';

export const fetchBalanceByIban = (iban) => ({
  type: FETCH_BALANCE_BY_IBAN,
  iban,
});

export const fetchBalanceByIbanSuccess = (balance) => ({
  type: FETCH_BALANCE_BY_IBAN_SUCCESS,
  balance,
});

export const fetchBalanceByIbanFailure = (error) => ({
  type: FETCH_BALANCE_BY_IBAN_FAILURE,
  error,
});
