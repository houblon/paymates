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

  state = {
    members: ['Jesse', 'Steve', 'Maria']
  }

  getSum = (total, num) => {
    return total + num;
  }

  roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  }

  getAmounts = (object) => {
    let arr = [];
    for (const x of Object.values(object)) {
      arr.push(x.amount);
    }
    return arr;
  }

  sumAllBillsPaidByMember = (member) => {
    const allBillsPaidByMember = entries.filter(p => p.payer === member && p.action === 'paid bill');
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allBillsPaidByMember).reduce(this.getSum));
    return sum;
  }

  sumReimbursementsReceived = (member) => {
    const allReceivedByMember = entries.filter(p => p.payee === member);
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReceivedByMember).reduce(this.getSum));
    return sum;
  }

  sumReimbursementsSent = (member) => {
    const allReimbursementsSent = entries.filter(p => p.payer === member && p.action === 'paid back');
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReimbursementsSent).reduce(this.getSum));
    return sum;
  }

  sumOwed = (member) => {
    const splitBills = entries.filter(p => p.proportions);
    let memberPortion = [];
    for (const bill of splitBills) {
      const amount = bill.amount;
      for (const [key, value] of Object.entries(bill.proportions)) {
        if (key === member) {
          memberPortion.push(value * amount);
        }
      }
    }
    
    const sum = this.roundToTwoDecimalPlaces(memberPortion.reduce(this.getSum));
    return sum;
  }

  calculateBalance = (member) => {
    const b = this.sumAllBillsPaidByMember(member) - 
              this.sumOwed(member) + 
              this.sumReimbursementsSent(member) -
              this.sumReimbursementsReceived(member);
    const rounded = this.roundToTwoDecimalPlaces(b);
    return rounded;
  }

  componentDidMount () {
    for (const member of this.state.members) {
      console.log(member, 'balance', this.calculateBalance(member));
      console.log('Total bills paid by', member, ':', this.sumAllBillsPaidByMember(member));
      console.log(member, 'owes', this.sumOwed(member));
      console.log('Total reimbursements sent by', member, ':', this.sumReimbursementsSent(member));
      console.log('Total reimbursements received by', member, ':', this.sumReimbursementsReceived(member));
    }
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
