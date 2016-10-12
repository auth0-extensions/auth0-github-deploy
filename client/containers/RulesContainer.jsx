import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';

import { ruleActions } from '../actions';

import { Error, LoadingPanel } from '../components/Dashboard';
import RulesTable from '../components/RulesTable';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    rules: state.rules.get('records'),
    loading: state.rules.get('loading'),
    error: state.rules.get('error'),
    showNotification: state.rules.get('showNotification'),
    notificationType: state.rules.get('notificationType')
  });

  static actionsToProps = {
    ...ruleActions
  }

  static propTypes = {
    rules: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired,
    fetchAllRules: PropTypes.func.isRequired,
    updateRules: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchAllRules();
  }

  render() {
    const rules = this.props.rules;
    const loading = this.props.loading;
    const error = this.props.error;
    return (
      <div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
              <RulesTable rules={rules}
                          loading={loading}
                          error={error}
                          saveManualRules={this.props.updateRules}
                          openNotification={this.props.openNotification}
                          closeNotification={this.props.closeNotification}
                          showNotification={this.props.showNotification}
                          notificationType={this.props.notificationType}
              />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
