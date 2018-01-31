import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import history from '../utils/history'
import Login from './Login'
import Home from './Home'
import Trade from './Trade'
import NotFound from './404'

class App extends Component {
  render() {
    return (
      <Router history={history}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/monitor" component={Home} />
            <Route path="/trade" component={Trade} />
            <Route component={NotFound} />
          </Switch>
      </Router>
    );
  }
}

export default App;
