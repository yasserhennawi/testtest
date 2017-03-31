import { call } from 'utils/endpointAccessManager';

const findByIban = (iban) => call({
  method: 'get',
  uri: `balance/${iban}`,
});

export default {
  findByIban,
};
