/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';


import ReactDOM from "react-dom";

// Always redirect to https module (since GAE custom env doesn't allow to do that)
import HttpsRedirect from 'react-https-redirect';

import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import history from './history';
import { rootILMReducer } from './redux/reducers';
import loginStore from './redux/stores/LoginStore';

import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL";
import AdminLayout from "layouts/Admin.js";


import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import "./styles.css"
import { useParams } from 'react-router';


const middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(rootILMReducer, composeWithDevTools(
  applyMiddleware(...middleware),
));

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    loginStore.isLoggedIn() ?
      <Component {...props} /> : (<Redirect to={{
        pathname: '/auth/login-page?path=',
        state: { from: props.location }
      }} />)
  )}
  />
)


ReactDOM.render(
  <HttpsRedirect disabled={process.env.REACT_APP_HTTPS === 'false'}>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/rtl" component={RtlLayout} />
          <Route path="/auth" component={AuthLayout} />
          <AuthenticatedRoute path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/team-tasks" />
        </Switch>
      </Router>
    </Provider>
  </HttpsRedirect>,
  document.getElementById("root")
);
