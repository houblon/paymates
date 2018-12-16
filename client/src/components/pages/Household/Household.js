import React, { Component } from 'react';
import './Household.css';

import Button from '../../Button/Button.js';
import { log } from 'util';

class Household extends Component {
  state = {
    members: [],
    transactions: []
  }
  

  extractID = (data) => {
    return Object.values(data[0])[0]
  }

  extractName = (data) => {
    return Object.values(data[0])[1]
  }

  extractMembers = (data) => {
    const arr = []
    for (const member of Object.values(data[0])[2]) {
      let tempArr = []
      tempArr.push(member.id, member.name)
      arr.push(tempArr)
    }
    //console.log(arr);
    return arr
  }

  transformTransactions = (data) => {
    const arr = []
    for (const transaction of Object.values(data[0])[4]) {
      let tempArr = []
      let propArr = []
      tempArr.push(
        transaction.id,
        transaction.date,
        transaction.action,
        transaction.amount,
        transaction.payer_ID,
        transaction.payee
        )
        if (transaction.proportions) {
          for (const proportion of Object.entries(transaction.proportions)) {
            //console.log(proportion[0])
            //console.log(proportion[1])
            propArr.push(proportion)
          }
          tempArr.push(propArr)
        }
      arr.push(tempArr)
    }
    //console.log(arr);
    return arr
    return Object.values(data[0])[4]
  }

  sumAllBillsPaidByMember = (memberID) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction[4] === memberID && transaction[2] === 'bill') {
        total += Number(transaction[3])
      }
    }
    //console.log("Bills Paid by " + memberID + ": " + total);
    return total
  }
  sumProportionsOwed = (memberID) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      //console.log(transaction);
      if (transaction[2] === 'bill') {
        //console.log(transaction[2]);
        for (const proportion of transaction[6]) {
          //.hasOwnProperty(memberID)) {
            if (proportion[0] === memberID) {
            total += (Number(transaction[3]) * Number(proportion[1]))
        }
        }
      }
    }
    //console.log("Sum of proportions of bills owed by " + memberID + ": "  + total);
    return total
  }
  sumReimbursementsSent = (memberID) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction[4] === memberID && transaction[2] === "reimbursement") {
        total += Number(transaction[3])
      }
    }
    //console.log("Reimbursements Sent " + memberID + ": "  + total);
    return total
  }
  sumReimbursementsReceived = (memberID) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction[4] === memberID) {
        total += Number(transaction[3])
      }
    }
    //console.log("Reimbursements Received " + memberID + ": "  + total);
    return total
  }
  roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  }

  calculateMemberBalance = () => {
    const memberBalances = []
    for (const member of this.state.members) {
      const balanceArr = [member[1]]
      const memberID = member[0]
      const memberName = member[1]

      const balance = this.sumAllBillsPaidByMember(memberID) -
      this.sumProportionsOwed(memberID) +
      this.sumReimbursementsSent(memberID) -
      this.sumReimbursementsReceived(memberID);
      const roundedBalance = this.roundToTwoDecimalPlaces(balance);
      // console.log('Balance for ' + member + ": $" + rounded);
      balanceArr.push(roundedBalance)
      memberBalances.push(balanceArr)
    }
    return memberBalances
  }

  componentDidMount () {
    const id = this.props.match.params.id;
    //console.log(id);
    fetch(`/api/household/${id}`)
    .then(response => response.json())
      .then(data => {
        console.log(data)
        //console.log(Object.values(data[0])[1])
        this.setState({
          householdID: this.extractID(data),
          householdName: this.extractName(data),
          members: this.extractMembers(data),
          transactions: this.transformTransactions(data)
        }, () => {
          this.setState({
            memberBalances :this.calculateMemberBalance()
          })
        })
      });
  }

  render() {
    return (
      <div className="Household-Report">
        <h1>Household Report</h1>
        <h2>Household Name:</h2>
        <p>{this.state.householdName}</p>
        <h2>Household ID:</h2>
        <p>{this.state.householdID}</p>

        <h2>Members:</h2>
        {
          this.state.members.map(([id, name]) => (
            <div>
              <p>Member ID: {id}</p>
              <p>Member Name: {name}</p>
            </div>
          ))
        }
        <h2>Transactions:</h2>

        {
          this.state.transactions.map(([id, date, action, amount, payer_ID, payee, proportions ]) => (
            <div>
              <p>Transaction ID: {id}</p>
              <p>Date: {date}</p>
              <p>Action: {action}</p>
              <p>Amount: {amount}</p>
              <p>Payer: {payer_ID}</p>
              <p>Payee: {payee}</p>
              <p>Proportions: {proportions}</p>
              <hr />
            </div>
          ))
        }
      </div>
    );
  }
}

export default Household;
