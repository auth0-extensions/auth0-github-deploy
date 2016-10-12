import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

class Alert extends Component {

  render() {
    const showAlert = this.props.show;
    const children = this.props.children;
    if (!showAlert) {
      return null;
    }
    return (
      <div className="alert alert-success">
        <button onClick={this.props.onClose}
                type="button"
                className="close"><span>&times;</span></button>
        {children}
      </div>
    );
  }
}

Alert.propTypes = {
  show: React.PropTypes.bool.isRequired,
  type: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.required
};

export default Alert;
