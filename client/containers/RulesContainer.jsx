import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';

import { ruleActions } from '../actions';

import { Error, LoadingPanel } from '../components/Dashboard';
import RulesTable from '../components/RulesTable';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    rules: state.rules.get('records')
  });

  static actionsToProps = {
    ...ruleActions
  }

  static propTypes = {
    rules: PropTypes.object.isRequired,
    fetchAllRules: PropTypes.func.isRequired,
    updateRules: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchAllRules();
  }

  render() {
    const error = null;
    const loading = false;
    const rules = this.props.rules;
    return (
      <div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
              <RulesTable rules={rules} loading={loading} error={error} saveManualRules={this.props.updateRules} />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
});
