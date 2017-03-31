import { takeLatest, takeEvery, call, put } from 'redux-saga/effects';
import {
  FETCH_BALANCE_BY_IBAN,
} from './constants';
import {
  fetchBalanceByIbanSuccess,
  fetchBalanceByIbanFailure,
} from './actions';
import balanceApi from './apis';

export function* fetchBalanceByIban({ iban }) {
  try {
    const response = yield call([balanceApi, balanceApi.findByIban], iban);
    yield put(fetchBalanceByIbanSuccess(response));
  } catch (error) {
    yield put(fetchBalanceByIbanFailure(error));
  }
}

export function* watchFetchBalanceByIban() {
  yield takeEvery(FETCH_BALANCE_BY_IBAN, fetchBalanceByIban);
}

export default [
  watchFetchBalanceByIban,
];
