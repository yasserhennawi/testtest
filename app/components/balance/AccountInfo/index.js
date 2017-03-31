import React from 'react';

class AccountInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  
  static propTypes = {
    info: React.PropTypes.shape({
      name: React.PropTypes.string,
      iban: React.PropTypes.string,
      balance: React.PropTypes.number,
    }),
  };

  static defaultProps = {
    info: {},
  };

  render() {
    const { info } = this.props;
    return (
      <div>
        <h3>Name:</h3>{info.name}
        <h3>IBAN:</h3>{info.iban}
        <h3>Balance:</h3>{info.balance}
      </div>
    );
  }
}

export default AccountInfo;
