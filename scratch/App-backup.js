import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

// Pull in entry data from the entries JSON file
// import entries from './needs-equalization.json';
//import entries from './entries.json';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import CreateHousehold from './components/pages/CreateHousehold/CreateHousehold.js';
import LogTransaction from './components/pages/LogTransaction/LogTransaction.js';
import FindHousehold from './components/pages/FindHousehold/FindHousehold.js';

class App extends Component {

  state = {
    members: ['Jesse', 'Steve', 'Maria'],
    entries: []
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
    const allBillsPaidByMember = this.state.entries.filter(p => p.payer === member && p.action === 'paid bill');
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allBillsPaidByMember).reduce(this.getSum));
    return sum;
  }

  sumReimbursementsReceived = (member) => {
    const allReceivedByMember = this.state.entries.filter(p => p.payee === member);
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReceivedByMember).reduce(this.getSum));
    return sum;
  }

  sumReimbursementsSent = (member) => {
    const allReimbursementsSent = this.state.entries.filter(p => p.payer === member && p.action === 'paid back');
    const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReimbursementsSent).reduce(this.getSum));
    return sum;
  }

  sumOwed = (member) => {
    // const splitBills = this.state.entries.filter(p => p.proportions);//probably use map
    const splitRates = this.state.entries.filter(p => p.proportions);//probably use map
    const owedArr = this.state.entries.map(entry => {
      const cost = entry.amount; //50
      const memberPortion = entry.proportions ? entry.proportions : {};
      const jessePortion = memberPortion ? memberPortion['jesse'] : 0;
      const owed = cost * jessePortion;
      return owed;
    })
    // [{jessie: 0.5, maria: 0.5, steve: 0.5}, ...]
    // console.log(member + ' splitBills ' + splitBills);
    let memberPortion = [];
    // debugger;
    for (const bill of splitRates) {
      console.log('bill: ' + bill);
      //console.log(bill);
      console.log(member + ' in splitBills loop');
      const amount = bill.amount;
      for (const [key, value] of Object.entries(bill.proportions)) {
        if (key === member) {
          console.log(member);
        // debugger;
          memberPortion.push(value * amount);
          console.log(memberPortion);
        }
      }
    }
    if (memberPortion.length > 0) {
      console.log(member + ' memberPortion > 0');
      // debugger;
      const sum = this.roundToTwoDecimalPlaces(memberPortion.reduce(this.getSum))

      return sum
    } else {
      console.log(member + ' memberPortion is not > 0: ' + memberPortion);
      const sum = memberPortion
      return sum
    }
    // return sum
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
    const entries = './hello.json'
    fetch(entries)
      .then(response => response.json()) // While developing with local JSON leave this commented;
                                            // turn back on when fetching from a database
      .then(responseJson => {
        console.log(typeof(responseJson));
        console.log(responseJson);
        //debugger;
        this.setState({
          entries: responseJson
        }, () => {
          console.log(this.state);
          //debugger;
        })
        console.log(responseJson);
        for (const member of this.state.members) {
          console.log('1 Total bills paid by', member, ':', this.sumAllBillsPaidByMember(member));


          // const billsPaidLabel = member+"BillsPaid"
          // const reimbursementSentLabel = member+"ReimbursementsSent"
          // const reimbursementsReceivedLabel = member+"reimbursementsReceived"
          // const balanceLabel = member+"Balance"
          // const owesOwedLabel = member+"OwesOwedPaid"
          // this.setState({
          //   [billsPaidLabel]: this.sumAllBillsPaidByMember(member),
          //   [reimbursementSentLabel]: this.sumReimbursementsSent(member),
          //   [reimbursementsReceivedLabel]: this.sumReimbursementsReceived(member),
          //   [balanceLabel]: this.calculateBalance(member),
          //   [owesOwedLabel]: this.sumOwed(member),
          // })
        }
      })
      .then(responseJson => {
        for (const member of this.state.members) {
          console.log('2 Total reimbursements sent by', member, ':', this.sumReimbursementsSent(member));
        }

      })
      .then(responseJson => {
        for (const member of this.state.members) {
          console.log('3 Total reimbursements received by', member, ':', this.sumReimbursementsReceived(member));
        }
      })
      .then(responseJson => {
        for (const member of this.state.members) {
          console.log('4 sumOwed by', member, ':', this.sumOwed(member));
        }
      })
      .then(responseJson => {
        for (const member of this.state.members) {
          console.log('5 calculateBalance for', member, ':', this.calculateBalance(member));
        }
      })
      .then(responseJson => {
        // for (const member of this.state.members) {
        //   const billsPaidLabel = member+"BillsPaid"
        //   this.setState({
        //     [billsPaidLabel]: this.sumAllBillsPaidByMember(member),
        //   })
        // }
      })
      .then(responseJson => {
        for (const member of this.state.members) {
          //
        }

      })
      .then(responseJson => {
        for (const member of this.state.members) {
          //
        }

      })
      .then(responseJson => {
        for (const member of this.state.members) {
          //
        }

      })
      .then(responseJson => {
        for (const member of this.state.members) {
          //
        }

      })
      .then(responseJson => {
        for (const member of this.state.members) {
          //
        }

      })
      .then(responseJson => {


      })
      .then(responseJson => {


      })
      .then(responseJson => {


      })
      .then(responseJson => {


      })
      ;
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
