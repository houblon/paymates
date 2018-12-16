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
    members: ['Jesse', 'Steve', 'Maria'],
  }
  roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  }
  sumAllBillsPaidByMember = (member) => {
    let total = 0
    for (const entry of this.state.entries) {
      if (entry.payer === member && entry.action === 'paid bill') {
        total += entry.amount
      }
    }
    // console.log("Bills Paid by " + member + ": " + total);
    return total
  }
  sumReimbursementsReceived = (member) => {
    let total = 0
    for (const entry of this.state.entries) {
      if (entry.payee === member) {
        total += entry.amount
      }
    }
    // console.log("Reimbursements Received " + member + ": "  + total);
    return total
  }
  sumReimbursementsSent = (member) => {
    let total = 0
    for (const entry of this.state.entries) {
      if (entry.payer === member && entry.action === "paid back") {
        total += entry.amount
      }
    }
    // console.log("Reimbursements Sent " + member + ": "  + total);
    return total
  }
  sumProportionsOwed = (member) => {
    let total = 0
    for (const entry of this.state.entries) {
      if (entry.action === 'paid bill' && entry.proportions.hasOwnProperty(member)) {
        total += (entry.amount * entry.proportions[member])
      }
    }
    // console.log("Sum of proportions of bills owed by " + member + ": "  + total);
    return total
  }
  calculateBalance = (member) => {
    const b = this.sumAllBillsPaidByMember(member) -
              this.sumProportionsOwed(member) +
              this.sumReimbursementsSent(member) -
              this.sumReimbursementsReceived(member);
    const rounded = this.roundToTwoDecimalPlaces(b);
    // console.log('Balance for ' + member + ": $" + rounded);
    return rounded;
  }
  sortBalances = (arr) => {
    arr.sort(function (a, b) {
      return a.balance - b.balance;
    })
  }
  countNeededLoops = (arr) => {
    let loopCount = 0
    let count = 0
    while (count < arr.length) {
      if (Math.abs(arr[count].balance) > this.state.members.length*.01) {
        loopCount++
      }
      count++
    }
    // console.log(loopCount);
    return loopCount
  }
  removeZeroBalances = (arr) => {
    let count = 0
    let newArr = []
    while (count < arr.length) {
      if (Math.abs(arr[count].balance) !== 0) {
        newArr.push(arr[count])
      }
      count++
    }
    return newArr
  }
  equalize = (arr) => {
    let recomendations = []
    this.sortBalances(arr)
    let loopCount = this.countNeededLoops(arr)
    // console.log(loopCount);
    let count = 0
    arr = this.removeZeroBalances(arr)
    // console.log(arr);
    while (count < loopCount) {
      if (Math.abs(arr[0].balance) < arr[arr.length-1].balance) {
        //console.log(Math.abs(arr[0].balance) + " is less than " + arr[arr.length-1].balance + "... So " + arr[0].name + " should pay " + arr[arr.length-1].name + " $" + Math.abs(arr[0].balance) + ".");
        //console.log(arr[arr.length-1].name + "'s new balance is: " + (arr[arr.length-1].balance-Math.abs(arr[0].balance)));
        recomendations.push(arr[0].name + " should pay " + arr[arr.length-1].name + " $" + Math.abs(arr[0].balance) + ".")
        arr[arr.length-1].balance = (arr[arr.length-1].balance-Math.abs(arr[0].balance))
        arr.splice(0, 1)
        this.sortBalances(arr)
      }
      count++
    }
    // console.log(recomendations);
    // console.log(arr);
    if (arr.length < 3) {
      // console.log('There are 0, 1, or 2 members that have balances other than absolute zero.')
      // console.log('Members with balances other than absolute zero after equalization: ' + arr.length);
      this.setState({
        recomendations: recomendations,
        overUnder: arr
      })
    } else if (arr.length > 2) {
      console.log('There is a problem. After equalizing there are at least 3 members with balances other than absolute zero.')
    }
  }

  componentDidMount () {
    fetch('/needs-equalization.json')
    // fetch('/entries.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          entries: responseJson
        })
      })
      .then(() => {
        const arr = []
        for (const member of this.state.members) {
          arr.push({
            name: member,
            balance: this.calculateBalance(member)
          })
        }
        this.setState({
          balances: arr,
          hypoTransactions: this.equalize(arr)
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
        <div>
          <Link to="/household/5c1430a2e5743f0bb34749be">House 1</Link>
          <Link to="/household/5c1430bd9c299a0bc44b4d96">House 2</Link>
        </div>
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
