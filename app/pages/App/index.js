/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FormattedMessage from 'components/utils/FormattedMessage';
import messages from './messages';

export class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    push: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(baseTheme)}>
        <div>
          {React.Children.toArray(this.props.children)}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = {
  push,
};

export default connect(undefined, mapDispatchToProps)(App);
