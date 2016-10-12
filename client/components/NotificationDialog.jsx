import React, { PropTypes, Component } from 'react';
import { Confirm } from './Dashboard';

export default class NotificationDialog extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.show !== this.props.show;
  }

  confirm = () => {
    this.props.onConfirm();
  }

  clear = () => {
    this.props.onClose();
  }

  render() {
    const show = this.props.show;
    const title = 'Warning';

    return (
      <Confirm
        title={title}
        show={show}
        onCancel={this.clear}
        onConfirm={this.confirm}
      >
        <p>
          With this extension your repository becomes the single source of truth.
          For example, this means that any rules that do not exist in your repository will be deleted from your Auth0 account.
          You can however choose to exclude some rules from this by marking them as “manual rules”. Do you wish to do this now?
        </p>
      </Confirm>
    );
  }
}
