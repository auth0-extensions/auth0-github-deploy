import React, { PropTypes, Component } from 'react';
import connectContainer from 'redux-static';

import { configActions } from '../actions';
import { Error } from '../components/Dashboard';

import Help from '../components/Help';
import WebhookSettings from '../components/WebhookSettings';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    config: state.config
  });

  static actionsToProps = {
    ...configActions
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    fetchConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchConfiguration();
  }

  render() {
    const { error, record } = this.props.config.toJS();

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Error message={error} />
            <WebhookSettings secret={record.secret} payloadUrl={`${window.config.BASE_URL}/webhooks/deploy`} repository={record.repository} branch={record.branch} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Help />
          </div>
        </div>
      </div>
    );
  }
});
