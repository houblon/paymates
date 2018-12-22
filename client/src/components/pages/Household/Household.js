import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Household.css';
import Button from '../../Button/Button';

class Household extends Component {
  state = {
    members: [],
    recomendations: [],
    transactions: [],
    fetchComplete: false,
  }

  // flashCopySuccessMessage = () => {
  //   document.getElementById('url_copied_success_message').classList.remove('hide');
  //   setTimeout(() => {
  //     document.getElementById('url_copied_success_message').classList.add('hide');
  //   }, 1000);
  // }

  // copyURLtoClpboard = () => {
  //   const url = this.getURL();
  //   this.copyToClipboard(url);
  //   this.flashCopySuccessMessage();
  // }

  // getURL = () => {
  //   const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
  //   // console.log('url', url);
  //   return url;
  // }

  // copyToClipboard = (str) => {
  //   const el = document.createElement('textarea');  // Create a <textarea> element
  //   el.value = str;                                 // Set its value to the string that you want copied
  //   el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
  //   el.style.position = 'absolute';                 
  //   el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  //   document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
  //   const selected =            
  //     document.getSelection().rangeCount > 0        // Check if there is any content selected previously
  //       ? document.getSelection().getRangeAt(0)     // Store selection if found
  //       : false;                                    // Mark as false to know no selection existed before
  //   el.select();                                    // Select the <textarea> content
  //   document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  //   document.body.removeChild(el);                  // Remove the <textarea> element
  //   if (selected) {                                 // If a selection existed before copying
  //     document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
  //     document.getSelection().addRange(selected);   // Restore the original selection
  //   }
  // };

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
  addMemberNames = (data) => {
    const members = data.members
    const transactions = data.transactions
    // console.log(members);
    // console.log(transactions);
    let newTransactionsArray = []
    for (const transaction of transactions) {
      const payer_ID = transaction.payer_ID
      const recipient_ID = transaction.recipient_ID
      for (const member of members) {
        if (Number(member.id) === Number(payer_ID) && transaction.proportions) {
          // console.log("Payers: member.id === payer_ID" + " " + member.id + " is " + payer_ID);
          // console.log(member.name);
          // console.log(transaction);
          transaction.payerName = member.name
          // debugger;
          newTransactionsArray.push(this.addProportionNames(transaction, members))
        }
        if (Number(member.id) === Number(recipient_ID)) {
          //console.log("Recipients: member.id === recipient_ID" + " " + member.id + " is " + recipient_ID);
          transaction.recipientName = member.name
          newTransactionsArray.push(transaction)
        }
      }
    }
    //console.log(newTransactionsArray);
    return newTransactionsArray
  }
  addProportionNames = (transaction, members) => {
    // debugger;
    // console.log(members);
    // console.log(transaction);
    const proportions = transaction.proportions
    for (const proportion of proportions) {
      for (const member of members) {
        const memID = Number(member.id)
        const propMemID = Number(proportion.member_ID)
        if (memID === propMemID) {
          proportion.name = member.name
        }
      }
    }
    return transaction
  }
  componentDidMount () {
    const id = this.props.match.params.id;
    fetch(`/api/households/${id}`)
      .then(response => response.json())
      // .then(() => {debugger;})
      .then(data => {
        // debugger;
        //console.log(data)
        //console.log(Object.values(data[0])[1])
        if (data[0]) {
          console.log('data[0]',data[0]);
          // debugger;
          this.setState({
            fetchComplete: true,
            rawData: data,
            householdID: data[0]._id,
            householdName: data[0].name,
            // transactions: data[0].transactions,
            transactions: this.addMemberNames(data[0]),
          }, () => {
            this.setState({
              members: this.calculateMemberBalance(data[0].members),
            }, () => {
              this.setState({
                recomendations: this.recomendations(this.state.members)
              })
              console.log(this.state.transactionsZZZ);
              
            })
          })
        }
      })
      .then(() => {
        this.setState({
          fetchComplete: true,
        });
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
        //console.log('Less than');
        //console.log(arr);
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
      
      !this.state.fetchComplete ?
        <p>LOADING&hellip;</p>
      :
      ( 
        this.state.householdID ? 
          <div className="Household-Report">
            <h1>Household Report for {this.state.householdName}</h1>
            <h2>Household ID: {this.state.householdID}</h2>
            {/* <div className="block-level-button">
              <Button
                label='Copy Household Link'
                className="submit_on_white"
                onClick={this.copyURLtoClpboard}
              />
              <span id="url_copied_success_message" className="url_copied_success_message hide">Copied!</span>
            </div> */}
            <h2>Members:</h2>
            {
              this.state.members.map(member => (
                <p>{member.name}</p>
              ))
            }
            {
              this.state.transactions.length > 0 ?
                <div className="balances">
                  <h2>Balances:</h2>
                  {
                    this.state.members.map(memberSummary => (
                      <p>{memberSummary.name}: {memberSummary.balance > 0 ? "+$" + memberSummary.balance: memberSummary.balance}</p>
                    ))
                  }
                </div>
              : null
            }
            {
              this.state.transactions.length > 0 ?
                <div className="recommendations">
                  <h2>In order to settle up:</h2>
                  {
                    this.state.recomendations.map(rec => (
                      <p>{rec}</p>
                    ))
                  }
                </div>
              : null
            }
            <div className="block-level-button">
              <Link to={"/household/" + this.state.householdID + "/log-transaction"}>
                <Button
                  label={this.state.transactions.length > 0 ? "Log a New Transaction" : "Log a New Transaction to Get Started"}
                  className="submit_on_white"
                />
              </Link>
            </div>
            {
              this.state.transactions.length > 0 ?
                <div className="transactions-container">
                  <h2>Transaction history:</h2>
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
                              <div><span className="mobile">Amount:</span>${transaction.amount}</div>
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
                              <div><span className="mobile">Payer:</span>{transaction.payerName}</div>
                            </td>
                            {
                              transaction.payee ? <td>
                                                    <div><span className="mobile">Payee:</span>{transaction.payee}</div>
                                                  </td> 
                                                : <td className="empty"></td>
                            }
                            {
                              transaction.recipient_ID ?  <td>
                                                            <div><span className="mobile">Recipient:</span>{transaction.recipientName}</div>
                                                          </td>
                                                          : <td className="empty"></td>
                            }
                            <td>
                              <div className="mobile">Proportions:</div>
                              <div className={transaction.proportions ? '' : 'empty'}>
                              {
                                transaction.proportions ? transaction.proportions.map(proportion => (
                                  <div>{proportion.name} : {proportion.proportion}%</div>
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
                </div>
              : null
            }
          </div>
        : <div>
            <h1>uh-oh...</h1>
            <h2>The household with id "{this.props.match.params.id}" was not found.</h2>
            <p>Are you sure you have the correct url?</p>
            <div className="block-level-button">
              <Link to="/find-household/">
                <Button
                  label="Find your Household"
                  className="submit_on_white"
                />
              </Link>
            </div>
            <div className="block-level-button">
              <Link to="/create-household/">
                <Button
                  label="Create a Household"
                  className="submit_on_white"
                />
              </Link>
            </div>
          </div>
      )
    );
  }
}

export default Household;
