/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import FormattedMessage from 'components/utils/FormattedMessage';
import { Element, scroller } from 'react-scroll';
import theme from 'theme/default';
import messages from './messages';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    push: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>Home page</div>
    );
  }
}

const mapDispatchToProps = {
  push,
};

export default connect(undefined, mapDispatchToProps)(HomePage);

