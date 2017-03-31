import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';

class DebitsAndCreditsList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  
  static propTypes = {
    list: React.PropTypes.array,
    currency: React.PropTypes.string,
  };

  static defaultProps = {
    list: [],
    currency: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: '300px',
    };
  }

  render() {
    const { list, currency } = this.props;

    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn colSpan="5" tooltip="This is the balance sheet details" style={{textAlign: 'center'}}>
                Balance sheet details
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The Description">Description</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Amount">Amount (in {currency})</TableHeaderColumn>
              <TableHeaderColumn tooltip="The From">From</TableHeaderColumn>
              <TableHeaderColumn tooltip="The To">To</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Date">Date</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {list.map((item, index) => (
              <TableRow key={index}>
                <TableRowColumn>{item.description}</TableRowColumn>
                <TableRowColumn>{item.amount}</TableRowColumn>
                <TableRowColumn>{item.from}</TableRowColumn>
                <TableRowColumn>{item.to}</TableRowColumn>
                <TableRowColumn>{item.date}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter
            adjustForCheckbox={this.state.showCheckboxes}
          >
            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                Copyright (C) eVision 2017
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

export default DebitsAndCreditsList;
