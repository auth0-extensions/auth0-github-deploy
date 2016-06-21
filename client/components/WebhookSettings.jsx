import React, { Component } from 'react';

export default class WebhookSettings extends Component {
  static defaultProps = {
    repository: '',
    branch: '',
    payloadUrl: 'N/A',
    secret: '',
    contentType: 'application/json'
  };

  static propTypes = {
    payloadUrl: React.PropTypes.string,
    contentType: React.PropTypes.string,
    secret: React.PropTypes.string,
    repository: React.PropTypes.string,
    branch: React.PropTypes.string
  }

  render() {
    const { payloadUrl, secret, contentType, repository, branch } = this.props;

    return (
      <div>
        <h5>Webhook Settings</h5>
        <p>A webhook has to be created in <strong><a href={`https://github.com/${repository}/settings/hooks`}>{repository}</a></strong> with the following settings to enable deployments from GitHub (<strong>{branch}</strong> branch).</p>
        <form className="form-horizontal col-xs-9">
          <div className="form-group">
            <label className="col-xs-2 control-label">Payload URL</label>
            <div className="col-xs-9">
              <input type="text" readOnly="readonly" className="form-control" value={payloadUrl} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label">Content Type</label>
            <div className="col-xs-9">
              <input type="text" readOnly="readonly" className="form-control" value={contentType} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-2 control-label">Secret</label>
            <div className="col-xs-9">
              <input type="text" readOnly="readonly" className="form-control" value={secret} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
