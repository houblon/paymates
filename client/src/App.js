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

  getSum = (total, num) => {
    return total + num;
  }

  sumAllBillsPaidByMember = (member) => {
    const allBillsPaidByMember = entries.filter(p => p.payer === member && p.action === 'paid bill');
    let myArr = [];
    for (const transaction of Object.values(allBillsPaidByMember)) {
      myArr.push(transaction.amount);
    }
    let sum = myArr.reduce(this.getSum)
    console.log("Total bills paid by " + member + ": " + sum);
    return sum;
  }

  componentDidMount () {
    // Uses filter to narrow down object into
    const jessePaymentsRecieved = entries.filter(p => p.payee === 'Jesse');
    this.sumAllBillsPaidByMember("Jesse");
    const jessePaymentsMade = entries.filter(p => p.payer === 'Jesse' && p.action === 'paid back');

    const mariaPaymentsRecieved = entries.filter(p => p.payee === 'Maria');
    this.sumAllBillsPaidByMember("Maria");
    const mariaPaymentsMade = entries.filter(p => p.payer === 'Maria' && p.action === 'paid back');

    const stevePaymentsRecieved = entries.filter(p => p.payee === 'Steve');
    this.sumAllBillsPaidByMember("Steve");
    const stevePaymentsMade = entries.filter(p => p.payer === 'Steve' && p.action === 'paid back');
  }
  render() {
    return (
      <div className="Paymates-body">
        <nav className="Paymates-navigation">
          <h1 className="Paymates-title"><Link to="/">paymates</Link></h1>
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
