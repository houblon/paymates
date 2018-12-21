import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Household.css';
import Button from '../../Button/Button';

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
            total += (Number(transaction.amount) * (Number(proportion.proportion)*.01))
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
      //console.log(member.name + " : " + this.sumAllBillsPaidByMember(member.id) + " - " + this.sumProportionsOwed(member.id) + " + " + this.sumReimbursementsSent(member.id) + " - " + this.sumReimbursementsReceived(member.id) + " = " + roundedBalance)
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
              recomendations: this.recomendations(this.state.members)
            })
          })
        })
      });
  }
  sortBalances = (arr) => {
  return arr.sort(function (a, b) {
    return a[1] - b[1];
  })
  }
 
  recomendations = (memberSummarys) => {
    let builtArr = []
    for (const summary of memberSummarys) {
      let summaryArr = []
      if (Math.abs(summary.balance) > (memberSummarys.length*.01)) {
        summaryArr.push(summary.id.toString(), Number(summary.balance), summary.name)
        builtArr.push(summaryArr)
      }
    }
    //console.log(builtArr);
    let arr = this.sortBalances(builtArr)
    return this.equalize(arr)
  }
  equalize = (arr) => {
    //console.log(arr);
    let recomendations = []
    let loopCount = arr.length-1
    let count = 0
    while (count < loopCount) {
      //console.log(arr);
      count++
      if (Math.abs(arr[0][1]) <= arr[arr.length-1][1]) {
        console.log('Less than');
        console.log(arr);
        recomendations.push(arr[0][2] + " should pay " + arr[arr.length-1][2] + " $" + Math.abs(arr[0][1]) + ".")
        arr[arr.length-1][1] = arr[arr.length-1][1]-Math.abs(arr[0][1])
        arr[0][1] = 0
        arr = this.buildNextArr(arr)
      } else if (Math.abs(arr[0][1]) >= arr[arr.length-1][1]) {
        console.log('Greater than');
        console.log(arr);
        recomendations.push(arr[0][2] + " should pay " + arr[arr.length-1][2] + " $" + arr[arr.length-1][1] + ".")
        arr[arr.length-1][1] = 0
        arr[0][1] = arr[0][1] + arr[arr.length-1][1]
        arr = this.buildNextArr(arr)
      }
    }
    return recomendations
  } 
  buildNextArr = (arr) => {
    let nextArr = []
    //console.log(arr);
    for (const summary of arr) {
      //console.log(summary[1]);
      if (summary[1] !== 0) {
        //console.log('not equal');
        nextArr.push(summary)
      }
    }
    //console.log(nextArr);
    let sentArr = this.sortBalances(nextArr)
    return sentArr
  }
  render() {
    return (
      this.state.householdID ? 
        <div className="Household-Report">
        <h1>Household Report for {this.state.householdName}</h1>
        <h2>Household ID: {this.state.householdID}</h2>
        <h2>Members:</h2>
        {
          this.state.members.map(member => (
            <span> Name: {member.name}, ID: {member.id}.</span>
          ))
        }
        <h2>Recommendations:</h2>
        {
          this.state.recomendations.map(rec => (
            <p>{rec}</p>
          ))
        }
        <div>
          <Link to={"/household/" + this.state.householdID + "/log-transaction"}>
            <Button
              label="Log a New Transaction"
              className="submit_on_white"
            />
          </Link>
        </div>
        <h2>Transactions:</h2>
        <div className="table-container">
          <table className="Household-Transactions">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Action</th>
                <th>Amount</th>
                {/* <th>Currency</th> */}
                <th>Payer</th>
                <th>Payee</th>
                <th>Recipient</th>
                <th>Proportions</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.transactions.map(transaction => (
                  <tr>
                    <td className="transaction-id">
                      <div><span className="mobile">Transaction ID:</span>{transaction.id}</div>
                    </td>
                    <td>
                      <div><span className="mobile">Date:</span>
                        {
                          (new Date(transaction.date*1000).getUTCMonth() + 1) + '/' +
                          new Date(transaction.date*1000).getUTCDate() + '/' +
                          new Date(transaction.date*1000).getUTCFullYear()
                        }
                      </div>
                    </td>
                    <td>
                      <div><span className="mobile">Action:</span>{transaction.action}</div>
                    </td>
                    <td>
                      <div><span className="mobile">Amount:</span>{transaction.amount}</div>
                    </td>
                    {/* {
                      transaction.currency ? 
                        <td>
                          <div className="mobile">Currency:</div>
                          <div>{transaction.currency}</div>
                        </td>
                        : <td className="empty"></td>
                    } */}
                    <td>
                      <div><span className="mobile">Payer:</span>{transaction.payer_ID}</div>
                    </td>
                    {
                      transaction.payee ? <td>
                                            <div><span className="mobile">Payee:</span>{transaction.payee}</div>
                                          </td> 
                                        : <td className="empty"></td>
                    }
                    {
                      transaction.recipient_ID ?  <td>
                                                    <div><span className="mobile">Recipient:</span>{transaction.recipient_ID}</div>
                                                  </td>
                                                  : <td className="empty"></td>
                    }
                    <td>
                      <div className="mobile">Proportions:</div>
                      <div className={transaction.proportions ? '' : 'empty'}>
                      {
                        transaction.proportions ? transaction.proportions.map(proportion => (
                          <div>{proportion.member_ID} : {proportion.proportion}</div>
                        )) : null
                      }
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <h2>Balances:</h2>
        {
          this.state.members.map(memberSummary => (
            <div>{memberSummary.name}: {memberSummary.balance > 0 ? "+" + memberSummary.balance: memberSummary.balance}</div>
          ))
        }

        <div>
          <Link to={"/household/" + this.state.householdID + "/log-transaction"}>
            <Button
              label="Log a New Transaction"
              className="submit_on_white"
            />
          </Link>
        </div>

      </div>
      : <div>
          <h1>uh-oh...</h1>
          <h2>The household with id "{this.props.match.params.id}" was not found.</h2>
            <p>Are you sure you have the correct url?</p>
            <div>
              <Link to="/find-household/">
                <Button
                  label="Find your Household"
                  className="submit_on_white"
                />
              </Link>
            </div>
            <div>
              <Link to="/create-household/">
                <Button
                  label="Create a Household"
                  className="submit_on_white"
                />
              </Link>
            </div>
        </div>
    );
  }
}

export default Household;
