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
    // const allBillsPaidByMember = this.state.entries.filter(p => p.payer === member && p.action === 'paid bill');
    // const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allBillsPaidByMember).reduce(this.getSum));
    // return sum;
    //const arr = []
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payer == member && value.action == 'paid bill') {
        // ARRAY method
        //arr.push(value.amount)
        // OBJECT method
        // arr.push({
        //   payer: value.payer,
        //   amount: value.amount,
        // })

        // VARIABLE method
        total = total+value.amount
      }
    }
    console.log("Bills Paid by " + member + ": " + total);
    //console.log(arr);
    //console.log(this.sumArrayValues(arr));
    //const totalzzz = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    //console.log(totalzzz);
    console.log(total);
    return total
  }
  sumArrayValues = (input) => {
    var total =  0;
    for(var i=0;i<input.length;i++) {
      if(isNaN(input[i])){
        continue
      }
      total += Number(input[i])
    }
    return total
  }

  sumReimbursementsReceived = (member) => {
    // const allReceivedByMember = this.state.entries.filter(p => p.payee === member);
    // const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReceivedByMember).reduce(this.getSum));
    // return sum;
    //const arr = []
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payee === member) {
      //   arr.push({
      //     payee: value.payee,
      //     amount: value.amount,
      //   })
        total += value.amount
      }
    }
    //console.log(member + " reimb recieved:");
    //console.log("Reimb Received: " + total);
    //console.log(arr);
    return total
  }
  sumReimbursementsSent = (member) => {
    // const allReimbursementsSent = this.state.entries.filter(p => p.payer === member && p.action === 'paid back');
    // const sum = this.roundToTwoDecimalPlaces(this.getAmounts(allReimbursementsSent).reduce(this.getSum));
    // return sum;
    const arr = []
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.payer == member && value.action == "paid back") {
        arr.push({
          payer: value.payer,
          amount: value.amount,
        })
        total = total+value.amount
      }
    }
    //console.log(member + " reimb sent:");
    //console.log("Reimb Sent: " + total);
    //console.log(arr);
    return total
  }
  sumOwed = (member) => {
    const arr = []
    let total = 0
    for (const [key, value] of Object.entries(this.state.entries)) {
      if (value.action == 'paid bill' && value.proportions.hasOwnProperty(member)) {
        total = total + (value.amount * value.proportions[member])
        // console.log(value.proportions[member]);
        //console.log(Object.values(value.proportions));
      }
      // if (value.payer == member && value.action == "paid back") {
      //   arr.push({
      //   })
      // }
    }
    //console.log("BillsOwed: "+ total);
    return total
    //console.log(arr);
  }

  sumOwed_backup = (member) => {
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
      //console.log('bill: ' + bill);
      //console.log(bill);
      //console.log(member + ' in splitBills loop');
      const amount = bill.amount;
      for (const [key, value] of Object.entries(bill.proportions)) {
        if (key === member) {
          //console.log(member);
        // debugger;
          memberPortion.push(value * amount);
          //console.log(memberPortion);
        }
      }
    }
    if (memberPortion.length > 0) {
      //console.log(member + ' memberPortion > 0');
      // debugger;
      const sum = this.roundToTwoDecimalPlaces(memberPortion.reduce(this.getSum))

      return sum
    } else {
      //console.log(member + ' memberPortion is not > 0: ' + memberPortion);
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
    fetch('./needs-equalization.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          entries: responseJson
        }, () => {
          //console.log(this.state.entries);
        })
        for (const member of this.state.members) {
          this.calculateBalance(member)
          console.log('Balance for ' + member + ":" + this.calculateBalance(member));
        }
        for (const member of this.state.members) {
          console.log('1 Total bills paid by', member, ':', this.sumAllBillsPaidByMember(member));
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
      .then(responseJson => {for (const member of this.state.members) {}})
      .then(responseJson => {})
    }



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
