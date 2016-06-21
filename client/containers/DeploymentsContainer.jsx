import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { deploymentActions } from '../actions';

import { Error } from '../components/Dashboard';
import DeploymentsTable from '../components/DeploymentsTable';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    deployments: state.deployments
  });

  static actionsToProps = {
    ...deploymentActions
  }

  static propTypes = {
    deployments: PropTypes.object.isRequired,
    fetchDeployments: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchDeployments();
  }

  render() {
    const { error, records } = this.props.deployments.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <DeploymentsTable error={error} records={records} />
          </div>
        </div>
      </div>
    );
  }
});
