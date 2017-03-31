import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import FormattedMessage from 'components/utils/FormattedMessage';
import { CircularProgress } from 'material-ui';
import NotFound from 'components/utils/NotFound';
import IbanForm from 'components/balance/IbanForm';
import AccountInfo from 'components/balance/AccountInfo';
import DebitsAndCreditsList from 'components/balance/DebitsAndCreditsList';
import { fetchBalanceByIban } from './actions';
import selectBalancePage from './selectors';
import messages from './messages';

export class BalancePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    status: React.PropTypes.shape({
      isLoading: React.PropTypes.bool,
      success: React.PropTypes.bool,
    }),
    balance: React.PropTypes.object,
    fetchBalanceByIban: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
  };

  componentDidMount() {
    // todo: Pass IBAN value from textbox in IBAN form component
    this.props.fetchBalanceByIban('HTB0001234567');
  }

  render() {
    const {
      status,
      info,
      currency,
      debitsAndCredits,
    } = this.props;

    if (status.isLoading) {
      return (
        <CircularProgress />
      );
    }

    if (!status.success) {
      return (
        <NotFound />
      );
    }

    return (
      <div>
        <AccountInfo info={info} />
        <DebitsAndCreditsList list={debitsAndCredits} currency={currency} />
      </div>
    );
  }
}

const mapStateToProps = selectBalancePage();

const mapDispatchToProps = {
  push,
  fetchBalanceByIban,
};

export default connect(mapStateToProps, mapDispatchToProps)(BalancePage);

