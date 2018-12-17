import React, { Component } from 'react';
import './Household.css';

class Household extends Component {
  state = {
    members: [],
    transactions: [],
    memberBalances: [],
    recomendations: []
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
        transaction.recipient_ID
        )
        if (transaction.proportions) {
          for (const proportion of Object.entries(transaction.proportions)) {
            propArr.push(proportion)
          }
          tempArr.push(propArr)
        }
      arr.push(tempArr)
    }
    //console.log(arr);
    return arr
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
      if (transaction[2] === "reimbursement" && transaction[4] === memberID) {
        total += Number(transaction[3])
      }
    }
    //console.log("Reimbursements Sent " + memberID + ": "  + total);
    return total
  }
  sumReimbursementsReceived = (memberID) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction[2] === "reimbursement" && transaction[5] === memberID) {
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
    console.log(memberBalances);
    
    let count = 0
    for (const member of this.state.members) {
      console.log(memberBalances);
      const balanceObj = {} //member[1]
      const memberID = member[0]
      const memberName = member[1]
      const balance = this.sumAllBillsPaidByMember(memberID) -
      this.sumProportionsOwed(memberID) +
      this.sumReimbursementsSent(memberID) -
      this.sumReimbursementsReceived(memberID);
      const roundedBalance = this.roundToTwoDecimalPlaces(balance);
      //console.log(memberName + " : " + this.sumAllBillsPaidByMember(memberID) + " - " + this.sumProportionsOwed(memberID) + " + " + this.sumReimbursementsSent(memberID) + " - " + this.sumReimbursementsReceived(memberID) + " = " + roundedBalance)
      balanceObj.name = memberName
      balanceObj.balance = roundedBalance
      memberBalances.push(balanceObj)
      count++
      console.log(memberBalances);
      console.log(count);
      
    }
    console.log(memberBalances);
    
    return memberBalances
  }
  componentDidMount () {
    const id = this.props.match.params.id;
    fetch(`/api/household/${id}`)
    .then(response => response.json())
      .then(data => {
        //console.log(data)
        //console.log(Object.values(data[0])[1])
        this.setState({
          rawData: data,
          householdID: this.extractID(data),
          householdName: this.extractName(data),
          members: this.extractMembers(data),
          transactions: this.transformTransactions(data)
        }, () => {
          this.setState({
            memberBalances :this.calculateMemberBalance()
          }, () => {
            this.setState({
              recomendations: this.equalize()
            })
          })
        })
      });
  }

  /// Integrate functions below

sortBalances = (arr) => {
  arr.sort(function (a, b) {
    return a.balance - b.balance;
  })
}
countNeededLoops = (arr) => {
  let loopCount = 0
  let count = 0
  if (arr.length === 2) {
    return 1
  } else {
    while (count < arr.length) {
      if (Math.abs(arr[count].balance) > this.state.members.length*.01) {
        loopCount++
      }
      count++
    }
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
equalize = () => {
  let arr = this.state.memberBalances
  console.log(arr);
  let recomendations = []
  this.sortBalances(arr)
  let loopCount = this.countNeededLoops(arr)
  //console.log(loopCount);
  let count = 0
  arr = this.removeZeroBalances(arr)
  //console.log(arr);
  while (count < loopCount) {
    //console.log("while started");
    //console.log("First: " + Math.abs(arr[0].balance));
    //console.log("Second: " + arr[arr.length-1].balance);
    if (Math.abs(arr[0].balance) <= arr[arr.length-1].balance) {
      //console.log("enterred If");
      //console.log(Math.abs(arr[0].balance) + " is less than " + arr[arr.length-1].balance + "... So " + arr[0].name + " should pay " + arr[arr.length-1].name + " $" + Math.abs(arr[0].balance) + ".");
      //console.log(arr[arr.length-1].name + "'s new balance is: " + (arr[arr.length-1].balance-Math.abs(arr[0].balance)));
      recomendations.push(arr[0].name + " should pay " + arr[arr.length-1].name + " $" + Math.abs(arr[0].balance) + ".")
      arr[arr.length-1].balance = (arr[arr.length-1].balance-Math.abs(arr[0].balance))
      arr.splice(0, 1)
      this.sortBalances(arr)
    }
    count++
  }
  console.log(recomendations);
  console.log(arr);
  if (arr.length < 3) {
    console.log('There are 0, 1, or 2 members that have balances other than absolute zero.')
    // console.log('Members with balances other than absolute zero after equalization: ' + arr.length);
    return recomendations
  } else if (arr.length > 2) {
    console.log('There is a problem. After equalizing there are at least 3 members with balances other than absolute zero.')
    return arr
  }
}

///
  render() {
    return (
      <div className="Household-Report">
        <h1>Household Report</h1>
        <h2>Household Name: {this.state.householdName}</h2>
        <h2>Household ID: {this.state.householdID}</h2>
        <h2>Members:</h2>
        {
          this.state.members.map(([id, name]) => (
            <span> Name: {name}, ID: {id}.</span>
          ))
        }
        <h2>Recomendations:</h2>
        {
          this.state.recomendations.map(rec => (
            <span>{rec}</span>
          ))
        }
      <h2>Transactions:</h2>
        {
          this.state.transactions.map(([id, date, action, amount, payer_ID, payee, proportions ]) => (
            <div className="Household-Transactions">
              <div>Transaction ID: {id}</div>
              <div>Date: {date}</div>
              <div>Action: {action}</div>
              <div>Amount: {amount}</div>
              <div>Payer: {payer_ID}</div>
              <div>Payee: {payee}</div>
              <div>Proportions: {proportions}</div>
            </div>
          ))
        }
        <h2>Balances:</h2>
        {
          this.state.memberBalances.map(balance => (
            <div>{balance.name} : {balance.balance}</div>
          ))
        }
      </div>
    );
  }
}

export default Household;
