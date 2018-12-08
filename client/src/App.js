import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

// Pull in entry data from the entries JSON file
import entries from './entries.json';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CreateHousehold from './components/pages/CreateHousehold/CreateHousehold.js';
import LogTransaction from './components/pages/LogTransaction/LogTransaction.js';
import FindHousehold from './components/pages/FindHousehold/FindHousehold.js';

class App extends Component {
  componentDidMount () {
    // Uses filter to narrow down object into
    const jessePaymentsRecieved = entries.filter(p => p.payee === 'Jesse');
    const jesseBillPayments = entries.filter(p => p.payer === 'Jesse' && p.action === 'paid bill');
    const jessePaymentsMade = entries.filter(p => p.payer === 'Jesse' && p.action === 'paid back');

    const mariaPaymentsRecieved = entries.filter(p => p.payee === 'Maria');
    const mariaBillPayments = entries.filter(p => p.payer === 'Maria' && p.action === 'paid bill');
    const mariaPaymentsMade = entries.filter(p => p.payer === 'Maria' && p.action === 'paid back');

    const stevePaymentsRecieved = entries.filter(p => p.payee === 'Steve');
    const steveBillPayments = entries.filter(p => p.payer === 'Steve' && p.action === 'paid bill');
    const stevePaymentsMade = entries.filter(p => p.payer === 'Steve' && p.action === 'paid back');

    let jesseTotalBills = 0
    for (const [key, value] of Object.entries(jesseBillPayments)) {
          jesseTotalBills = jesseTotalBills + value.amount
        }
    console.log("Jesse paid this much to bills: " + jesseTotalBills);

    let mariaTotalBills = 0
    for (const [key, value] of Object.entries(mariaBillPayments)) {
          mariaTotalBills = mariaTotalBills + value.amount
        }
    console.log("Maria paid this much to bills: " + mariaTotalBills);

    let steveTotalBills = 0
    for (const [key, value] of Object.entries(steveBillPayments)) {
          steveTotalBills = steveTotalBills + value.amount
        }
    console.log("Steve paid this much to bills: " + steveTotalBills);

  }
  render() {
    return (
      <div className="Paymates-body">
        <nav className="Paymates-navigation">
          <h1 className="Paymates-title">paymates</h1>
          <h2><Link to="/">Home</Link></h2>
          <h2><Link to="/create-household/">Create Household</Link></h2>
        </nav>

        <div className="Paymates-mainContent">
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/create-household/' component={CreateHousehold} />
            <Route exact path='/log-transaction/' component={LogTransaction} />
            <Route exact path='/find-household/' component={FindHousehold} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
