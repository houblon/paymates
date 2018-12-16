import React, { Component } from 'react';
import './Household.css';

import Button from '../../Button/Button.js';
import { log } from 'util';

class Household extends Component {
  state = {
    members: [],
    transactions: []
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
        })
      });
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
    console.log(arr);
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
    console.log(arr);
    return arr
    return Object.values(data[0])[4]
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
