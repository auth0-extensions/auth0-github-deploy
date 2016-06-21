import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { deploymentActions } from '../actions';

import { Error } from '../components/Dashboard';
import DeploymentsTable from '../components/DeploymentsTable';
import DeploymentLogsDialog from '../components/DeploymentLogsDialog';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    deployments: state.deployments
  });

  static actionsToProps = {
    ...deploymentActions
  }

  static propTypes = {
    deployments: PropTypes.object.isRequired,
    openDeployment: PropTypes.func.isRequired,
    fetchDeployments: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchDeployments();
  }

  render() {
    const { error, records, activeRecord } = this.props.deployments.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <DeploymentsTable error={error} records={records} showLogs={this.props.openDeployment} />
            <DeploymentLogsDialog deployment={activeRecord} onClose={this.props.clearDeployment} />
          </div>
        </div>
      </div>
    );
  }
});
