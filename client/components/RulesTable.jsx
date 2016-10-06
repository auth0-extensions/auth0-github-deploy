import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow,
  Alert
} from './Dashboard';

export default class RulesTable extends Component {
  static propTypes = {
    rules: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired,
    saveManualRules: React.PropTypes.func.isRequired,
    openNotification: React.PropTypes.func.isRequired,
    closeNotification: React.PropTypes.func.isRequired,
    showNotification: React.PropTypes.bool.isRequired,
    notificationType: React.PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.rules !== this.props.rules || this.props.showNotification!==nextProps.showNotification;
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
        this.props.openNotification();
        setTimeout(()=>{
          this.props.closeNotification();
        },10000);
      });
  }

  render() {
    const { rules } = this.props;
    return (
      <div>
        <Alert show={this.props.showNotification}
               onClose={this.props.closeNotification}
               type={this.props.notificationType}
        >
          Manual rules were updated.
        </Alert>
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
        <button className="btn btn-success pull-right" onClick={this.onChangeManual}>Update Manual Rules
        </button>
      </div>
    );
  }
}
