import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';

import Header from '../components/Header';
import { Sidebar, SidebarItem } from '../components/Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        <Header issuer={this.props.issuer} user={this.props.user} onLogout={this.props.logout} />
        <div className="container">
          <div className="row">
            <Sidebar>
              <SidebarItem title="Config" route="/config" icon="icon icon-budicon-375" />
              <SidebarItem title="Deployments" route="/deployments" icon="icon icon-budicon-322" />
            </Sidebar>
            <div id="content" className="col-xs-10">
            { this.props.children }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.auth.get('user'),
    issuer: state.auth.get('issuer')
  };
}

export default connect(select, { logout })(App);
