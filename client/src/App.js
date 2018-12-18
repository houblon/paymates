import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CreateHousehold from './components/pages/CreateHousehold/CreateHousehold.js';
import LogTransaction from './components/pages/LogTransaction/LogTransaction.js';
import FindHousehold from './components/pages/FindHousehold/FindHousehold.js';
import Household from './components/pages/Household/Household.js';

class App extends Component {
  state = {
  }
  

  componentDidMount () {
  }

  render() {
    return (
      <div className="Paymates-body">
        <nav className="Paymates-navigation">
          <h1 className="Paymates-title"><Link to="/">paymates</Link></h1>
          <h2><Link to="/create-household/">Create Household</Link></h2>
          <h2><Link to="/household/5c1430a2e5743f0bb34749be">House 1</Link></h2>
          <h2><Link to="/household/5c1430bd9c299a0bc44b4d96">House 2</Link></h2>

        </nav>
        <div className="Paymates-mainContent">
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/create-household/' component={CreateHousehold} />
            <Route exact path='/household/:id/log-transaction/' component={LogTransaction} />
            <Route exact path='/find-household/' component={FindHousehold} />
            <Route exact path='/household/:id' component={Household} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
