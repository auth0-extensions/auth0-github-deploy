import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';
import { RequireAuthentication } from './containers/RequireAuthentication';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRedirect to="/config" />
      <Route path="config" component={containers.ConfigContainer} />
      <Route path="deployments" component={containers.DeploymentsContainer} />
    </Route>
  </Router>;
