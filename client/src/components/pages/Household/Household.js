import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Household.css';

class Household extends Component {
  state = {
    members: [],
    recomendations: [],
    transactions: [],
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
  sumAllBillsPaidByMember = (member) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction.payer_ID === member && transaction.action === 'bill') {
        total += Number(transaction.amount)
      }
    }
    //console.log("Bills Paid by " + member + ": " + total);
    return total
  }
  sumProportionsOwed = (member) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      //console.log(transaction);
      if (transaction.action === 'bill') {
        //console.log(transaction[2]);
        for (const proportion of transaction.proportions) {
          //.hasOwnProperty(memberID)) {
            if (proportion.member_ID === member) {
            total += (Number(transaction.amount) * Number(proportion.proportion))
        }
        }
      }
    }
    //console.log("Sum of proportions of bills owed by " + member + ": "  + total);
    return total
  }
  sumReimbursementsSent = (member) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction.action === "reimbursement" && transaction.payer_ID === member) {
        total += Number(transaction.amount)
      }
    }
    //console.log("Reimbursements Sent " + member + ": "  + total);
    return total
  }
  sumReimbursementsReceived = (member) => {
    let total = 0
    for (const transaction of this.state.transactions) {
      if (transaction.action === "reimbursement" && transaction.recipient_ID === member) {
        total += Number(transaction.amount)
      }
    }
    //console.log("Reimbursements Received " + member + ": "  + total);
    return total
  }
  roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  }
  calculateMemberBalance = (membersSummary) => {
    for (const member of membersSummary) {
      const balance = this.sumAllBillsPaidByMember(member.id) -
      this.sumProportionsOwed(member.id) +
      this.sumReimbursementsSent(member.id) -
      this.sumReimbursementsReceived(member.id);
      const roundedBalance = this.roundToTwoDecimalPlaces(balance);
      console.log(member.name + " : " + this.sumAllBillsPaidByMember(member.id) + " - " + this.sumProportionsOwed(member.id) + " + " + this.sumReimbursementsSent(member.id) + " - " + this.sumReimbursementsReceived(member.id) + " = " + roundedBalance)
      member.balance = roundedBalance
    }
    return membersSummary
  }
  
  componentDidMount () {
    const id = this.props.match.params.id;
    fetch(`/api/households/${id}`)
    .then(response => response.json())
      .then(data => {
        //console.log(data)
        //console.log(Object.values(data[0])[1])
        this.setState({
          rawData: data,
          householdID: data[0]._id,
          householdName: data[0].name,
          transactions: data[0].transactions,
        }, () => {
          this.setState({
            members: this.calculateMemberBalance(data[0].members),
          }, () => {
            this.setState({
              recomendations: this.equalize(this.state.members)
            })
          })
        })
      });
  }

sortBalances = (arr) => {
  console.log(arr);
  arr.sort(function (a, b) {
    return a[1] - b[1];
  })
}
countNeededLoops = (arr) => {
  let loopCount = 0
  let count = 0
  if (arr.length === 2) {
    return 1
  } else {
    while (count < arr.length) {
      //console.log(arr[count]);
      if (Math.abs(arr[count][1]) > this.state.members.length*.01) {
        //console.log(Math.abs(arr[count][1]) + " is greater than " + this.state.members.length*.01);
        loopCount++
      }
      count++
    }
  }
  // console.log(loopCount);
  return loopCount
}

equalize = (obj) => {
  let recomendations = []
  let arr = []
  for (const summary of obj) {
    let summaryArr = []
    if (Math.abs(summary.balance) > (obj.length*.01)) {
      summaryArr.push(summary.id, summary.balance, summary.name)
    }
    arr.push(summaryArr)
  }
  let loopCount = this.countNeededLoops(arr)
  console.log(loopCount);
  this.sortBalances(arr)
  let count = 0
  while (count < loopCount) {
    if (Math.abs(arr[0][1]) <= arr[arr.length-1][1]) {
      recomendations.push(arr[0][2] + " should pay " + arr[arr.length-1][2] + " $" + Math.abs(arr[0][1]) + ".")
      arr[arr.length-1][1] = (arr[arr.length-1][1]-Math.abs(arr[0][1]))
      arr.splice(0, 1)
      this.sortBalances(arr)
    } else if (arr[arr.length-1][1] <= Math.abs(arr[0][1])) {
      recomendations.push(arr[0][2] + " should pay " + arr[arr.length-1][2] + " $" + arr[arr.length-1][1] + ".")
      arr[arr.length-1][1] = 0
      arr.splice(arr.length-1, 1)
      this.sortBalances(arr)
    }
    count++
  }
  if (arr.length < 3) {
    //console.log('There are 0, 1, or 2 members that have balances other than absolute zero.')
    //console.log('Members with balances other than absolute zero after equalization: ' + arr.length);
    console.log(recomendations);
    
    return recomendations
  } else if (arr.length > 2) {
    console.log('There is a problem. After equalizing there are at least 3 members with balances other than absolute zero.')
    return "Hello"
  }
  return recomendations
}

///
  render() {
    return (
      this.state.householdID ? 
        <div className="Household-Report">
        <h1>Household Report</h1>
        <h2>Household Name: {this.state.householdName}</h2>
        <h2>Household ID: {this.state.householdID}</h2>
        <h2>Members:</h2>
        {
          this.state.members.map(member => (
            <span> Name: {member.name}, ID: {member.id}.</span>
          ))
        }
        <h2>Recomendations:</h2>
        {
          this.state.recomendations.map(rec => (
            <p>{rec}</p>
          ))
        }
        <h2>Transactions:</h2>
        {
          this.state.transactions.map(transaction => (
            <div className="Household-Transactions">
              <div>Transaction ID: {transaction.id}</div>
                <div>Date: {transaction.date}</div>
                <div>Action: {transaction.action}</div>
                <div>Amount: {transaction.amount}</div>
                {
                  transaction.currency ? <div>Currency: {transaction.currency}</div> : null
                }
                <div>Payer: {transaction.payer_ID}</div>
                {
                  transaction.payee ? <div>Payee: {transaction.payee}</div> : null
                }
                {
                  transaction.recipient_ID ? <div>Recipient: {transaction.recipient_ID}</div> : null
                }
                {
                  transaction.proportions ? transaction.proportions.map(proportion => (
                    <div>Proportions:
                      <div>{proportion.member_ID} : {proportion.proportion}</div>
                    </div>
                  )) : null
                }
            </div>
          ))
        }
        <h2>Balances:</h2>
        {
          this.state.members.map(memberSummary => (
            <div>{memberSummary.name} - {memberSummary.balance}</div>
          ))
        }
      </div>
      : <div>
          <h1>uh-oh...</h1>
          <h2>The household with id "{this.props.match.params.id}" was not found.</h2>
          <p>Are you sure you have the correct url?</p>
          <p><Link to="/find-household/">Find your Household</Link></p>
          <p><Link to="/create-household/">Create a Household</Link></p>
      </div>
    );
  }
}

export default Household;
