import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import  Home  from './components/Home';


/*
 * Module privates.
 */


/*
 * Module exports.
 */

const RootRoute = () => {
  return (
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route
          exact
          path={'/pokelist'}
          render={({ match }) => {
            return <Home page={0} />;
          }}
        />
        <Route
          exact
          path={'/pokelist/:page'}
          render={({ match }) => {
            return <Home page={match.params.page} />;
          }}
        />
        {/* </Route> */}
        {/* <Route path="/site" component={Site} /> */}
      </Switch>
    </BrowserRouter>
  );
};


export { RootRoute };
