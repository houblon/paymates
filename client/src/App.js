import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CreateHousehold from './components/pages/CreateHousehold/CreateHousehold.js';
import LogTransaction from './components/pages/LogTransaction/LogTransaction.js';
import FindHousehold from './components/pages/FindHousehold/FindHousehold.js';

class App extends Component {
  state = {
    members: ['Jesse', 'Steve', 'Maria'],
  }

  roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  }

  sumAllBillsPaidByMember = (member) => {
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payer === member && value.action === 'paid bill') {
        total = total+value.amount
      }
    }
    //console.log("Bills Paid by " + member + ": " + total);
    return total
  }
  sumReimbursementsReceived = (member) => {
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payee === member) {
        total += value.amount
      }
    }
    //console.log("Reimbursements Received " + member + ": "  + total);
    return total
  }
  sumReimbursementsSent = (member) => {
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payer === member && value.action === "paid back") {
        total = total+value.amount
      }
    }
    //console.log("Reimbursements Sent " + member + ": "  + total);
    return total
  }
  sumProportionsOwed = (member) => {
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.action === 'paid bill' && value.proportions.hasOwnProperty(member)) {
        total = total + (value.amount * value.proportions[member])
      }
    }
    //console.log("Sum of proportions of bills owed by " + member + ": "  + total);
    return total
  }
  calculateBalance = (member) => {
    const b = this.sumAllBillsPaidByMember(member) -
              this.sumProportionsOwed(member) +
              this.sumReimbursementsSent(member) -
              this.sumReimbursementsReceived(member);
    const rounded = this.roundToTwoDecimalPlaces(b);
    console.log('Balance for ' + member + ": $" + rounded);
    return rounded;
  }

  componentDidMount () {
    fetch('/needs-equalization.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          entries: responseJson
        })
      })
      .then(responseJson => {
        const arr = []
        for (const member of this.state.members) {
          arr.push({
            name: member,
            balance: this.calculateBalance(member)
          })
        }
        this.setState({
          balances: arr
        })
      });
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
