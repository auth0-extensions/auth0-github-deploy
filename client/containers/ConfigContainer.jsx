import React from 'react';
import { connect } from 'react-redux';

class ConfigContainer extends React.Component {

  render() {
    return <div />;
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { })(ConfigContainer);
