import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import './DeploymentLogsDialog.css';

export default class DeploymentLogsDialog extends Component {
  static propTypes = {
    deployment: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired
  };

  render() {
    if (!this.props.deployment) {
      return <div />;
    }

    const { id, date_relative, logs } = this.props.deployment;

    return (
      <Modal dialogClassName="deployment-logs-dialog" show={this.props.deployment !== null} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{id} - <span>{date_relative}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{logs.map(log => `${log.date} - ${log.message}\n`)}</pre>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button bsSize="small" onClick={this.props.onClose}>
              <i className="icon icon-budicon-501"></i> Close
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}
