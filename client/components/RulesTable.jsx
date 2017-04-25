import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableTextCell, TableHeader, TableColumn, TableRow, Alert } from 'auth0-extension-ui';

export default class RulesTable extends Component {
  static propTypes = {
    rules: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    saveManualRules: React.PropTypes.func.isRequired,
    openNotification: React.PropTypes.func.isRequired,
    closeNotification: React.PropTypes.func.isRequired,
    showNotification: React.PropTypes.bool.isRequired,
    notificationType: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      rules: this.toArray(props.rules)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rules: this.toArray(nextProps.rules)
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.rules !== this.props.rules || this.props.showNotification !== nextProps.showNotification;
  }

  onChangeManual = () => {
    const manualRules = [];
    this.state.rules.forEach((rule) => {
      if (this.refs[rule.name].checked) {
        manualRules.push(rule.name);
      }
    });

    this.props.saveManualRules({ names: manualRules })
      .then(() => {
        this.props.openNotification();
        setTimeout(this.props.closeNotification, 10000);
      });
  }

  toArray(rulesMap) {
    const rules = rulesMap && rulesMap.toJS();
    return Object.keys(rules).map((ruleName) => ({
      name: ruleName,
      isManual: rules[ruleName]
    }));
  }

  render() {
    const { rules } = this.state;

    return (
      <div>
        <Alert
          show={this.props.showNotification}
          onDismiss={this.props.closeNotification}
          type={this.props.notificationType}
          message="Manual rules have been saved."
        />
        <p>
          Rules that are flagged as manual rules will not be deleted, but any changes to metadata (order/status) will still be applied.
        </p>
        <Table>
          <TableHeader>
            <TableColumn width="80%">Name</TableColumn>
            <TableColumn width="20%">Manual Rule</TableColumn>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.name}>
                <TableTextCell>{rule.name}</TableTextCell>
                <TableCell>
                  <div className="switch-animate">
                    <input
                      className="uiswitch isManualRule" value={rule.name} defaultChecked={rule.isManual} type="checkbox"
                      name="isManualRule" ref={rule.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <button className="btn btn-success pull-right" onClick={this.onChangeManual}>Update Manual Rules</button>
      </div>
    );
  }
}
