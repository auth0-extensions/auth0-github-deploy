import React from 'react';
import { connect } from 'react-redux';

class DeploymentsContainer extends React.Component {

  render() {
    return <div />;
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { })(DeploymentsContainer);
