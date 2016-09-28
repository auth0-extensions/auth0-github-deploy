import React, { Component } from 'react';
import {
  Table,
  TableAction,
  TableCell,
  TableBody,
  TableIconCell,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from './Dashboard';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

export default class RulesTable extends Component {
  static propTypes = {
    rules: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    saveManualRules: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.rules !== this.props.rules;
  }

  onChangeManual = (e) => {
    const rules = this.props.rules;
    let manualRules = [];
    rules.map((isManual, index) => {
      if (this.refs[index].checked) {
        manualRules.push(this.refs[index].value);
      }
    });
    if (manualRules.length > 0)
      this.props.saveManualRules({ names: manualRules }).then(() => {
        Alert.info('Manual rules were updated.', {
          effect: 'slide',
          limit: 1
        });
      });
  }

  render() {
    const { rules } = this.props;
    return (
      <div>
        <Alert stack={{ limit: 3 }} position='top' />
        <Table>
          <TableHeader>
            <TableColumn width="80%">Name</TableColumn>
            <TableColumn width="20%">Manual Rule</TableColumn>
          </TableHeader>
          <TableBody>
            {rules.map((isManual, index) => {
              return (
                <TableRow key={index}>
                  <TableTextCell>{index}</TableTextCell>
                  <TableTextCell>
                    <div className="switch-animate">
                      <input className="uiswitch isManualRule" value={index} defaultChecked={isManual} type="checkbox"
                             name="iSManualRule" ref={index} />
                    </div>
                  </TableTextCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <button className="btn btn-success pull-right" onClick={this.onChangeManual}>Update Manual Rules</button>
      </div>
    );
  }
}
