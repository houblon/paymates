import React, { Component } from 'react';
import './LogTransaction.css';
import Button from '../../Button/Button.js';
import Input from '../../Input/Input.js';
import SelectList from 'react-widgets/lib/SelectList';

class LogTransaction extends Component {
  state = {
    transactionDate: '',
    payer_ID: '',
    payee: '',
    action: '',
    recipient_ID: '',
    amount: '',
    currency: 'USD',
    proportions: [],
    members: []
  }

  onChangeTransactionDate = (ev) => {
    this.setState({
      transactionDate: ev.target.value,
    });
  }
  onChangePayer = (ev) => {
    this.setState({
      // payer_ID: ev.target.value,
      payer_ID: ev.value,
    });
  }
  onChangePayee = (ev) => {
    this.setState({
      // payee: ev.target.value,
      payee: ev.value,
    });
  }
  onChangeAction = (ev) => {
    this.setState({
      // action: ev.target.value,
      action: ev.value,
    });
  }
  onChangeRecipient = (ev) => {
    this.setState({
      // recipient_ID: ev.target.value,
      recipient_ID: ev.value,
    });
  }
  onChangeAmount = (ev) => {
    this.setState({
      amount: ev.target.value,
    });
  }
  buildFormData = () => {
    let formData = {}
    if (this.state.action === "bill") {
      formData = {
      date: this.state.transactionDate,
      payer_ID: this.state.payer_ID,
      payee: this.state.payee,
      action: this.state.action,
      amount: this.state.amount,
      currency: this.state.currency,
      proportions: this.state.proportions
    }
    // console.log("Its a bill");
    // console.log("Inside bill formData: ");
    // console.log(formData);
    
    } else if (this.state.action === "reimbursement") {
      formData = {
      date: this.state.transactionDate,
      payer_ID: this.state.payer_ID,
      action: this.state.action,
      recipient_ID: this.state.recipient_ID,
      amount: this.state.amount,
      currency: this.state.currency
    }
    // console.log("Its a reimbursement");
    // console.log("Inside reim formData: ");
    // console.log(formData);
  }
    console.log("Sent formData:");
    console.log(formData);
    
    return formData
  }

  validateAmount = () => {
    return true;
  }      
  
  validate = () => {
    if (this.validateAmount /*&& this.validatesomethingelse */) {
      return true
    }
  }
  submit = () => {
    if (this.validate() === true) { //goes through each field does all its stuff & if FALSE the fields that need the user to fix can be stored in the state.
          const id = this.props.match.params.id;
            // THIS IS WHERE THE UPDATE FUNCTION NEEDS TO GO!!!
            fetch(`/api/households/${id}`, { // this route need to change
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(this.buildFormData()),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Got this back', data);
                // Redirect to homepage
                // this.props.history.push('/');
              });
      } else {
        this.renderErrors() // Pickup where this.validate left off & use what got set in state.
      }
  }
  renderErrors = () => {
    console.log("Errors were found.");
  }
  setDefaultProportions = (membersSummary) => {
    console.log(membersSummary);
    let defaultProportions = []
    let memberCount = membersSummary.length
    for (const summary of membersSummary) {
      const memberProportion = {}
      //console.log(summary);
      memberProportion.member_ID = summary.id
      memberProportion.proportion = Number(1/memberCount)
      //console.log(memberProportion);
      defaultProportions.push(memberProportion)
    }
    return defaultProportions
  }
  setProportions = (membersSummary) => {
    console.log(membersSummary);
    let newSummary = []
    let memberCount = membersSummary.length
    for (const summary of membersSummary) {
      //console.log(summary);
      summary.proportion = Number(1/memberCount)
      //console.log(memberProportion);
      newSummary.push(summary)
    }
    console.log(newSummary);
    return newSummary
  }
  onChangeProportion = (ev) => {
    const value = ev.target.value
    const id = ev.target.id.toString() //making this a string because right now some ids are "1" or 1. Which breaks the IF conditions below.
    const memberSummarys = this.state.members
    const newMemberSummarys = []
    for (const summary of memberSummarys) {
      const summaryID = summary.id.toString()
      if (summaryID === id) {
        summary.proportion = value
        newMemberSummarys.push(summary)
      } else {
        newMemberSummarys.push(summary)
      }
    }
    this.setState({
      members: newMemberSummarys
    })
  }

  componentDidMount () {
    // const currentURL = window.location.href
    // let result = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    // console.log(result);
    const id = this.props.match.params.id;
    console.log(id);
    fetch(`/api/households/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          rawData: data,
          householdID: data[0]._id,
          householdName: data[0].name,
          members: this.setProportions(data[0].members),
          proportions: this.setDefaultProportions(data[0].members)
        })
      })
  }

  render() {
    return (
      <div className="LogTransaction">
        <h1>Log a new transaction</h1>
        <Input
          name="Transaction date"
          placeholder="Enter transaction date"
          value={this.state.transactionDate}
          onChange={this.onChangeTransactionDate}
        />
        <br />
        <h2>Who Paid: {this.state.payer_ID}</h2>
        <SelectList
          data={
            this.state.members.map(member => (
              {
                value: member.id,
                label: member.name
              }
            ))
          }
          name='payer'
          onChange={this.onChangePayer}
          textField='label'
          value={this.state.payer_ID}
          valueField='value'
        />
        <br />
        <h2>Action type: {this.state.action}</h2>
          <SelectList
            data={
              [
                {
                  name: "bill",
                  label: "Paid Bill",
                  value: "bill",
                },
                {
                  name: "reimbursement",
                  label: "Paid Back",
                  value: "reimbursement",
                }
              ]
            }
            name='action'
            onChange={this.onChangeAction}
            textField='label'
            value={this.state.action}
            valueField='value'
          />
        <h2>Reimbursement Recipient: {this.state.recipient_ID}</h2>
          <SelectList
            data={
              this.state.members.map(member => (
                {
                  value: member.id,
                  label: member.name
                }
              ))
            }
            name='recipient'
            onChange={this.onChangeRecipient}
            textField='label'
            value={this.state.recipient_ID}
            valueField='value'
          />
        <Input
          name="Business name"
          placeholder="Paid what bill..."
          value={this.state.payee}
          onChange={this.onChangePayee}
        />
        <br />
        <Input
          name="Amount"
          placeholder="Amount"
          value={this.state.amount}
          onChange={this.onChangeAmount}
        />
        {
          this.state.members.map(member => (
            <div>
              <label>{member.name}'s proportion of the bill: {member.id}</label>
            <Input
              name={member.name + "'s proportion"}
              placeholder={member.name + "'s proportion"}
              id={member.id} // Using the ID parameter for passing ID to function. Asking Michael / Maddy about best practices on this.
              value={member.proportion}
              onChange={this.onChangeProportion}
            />
            </div>
          ))
        }
        <Button
          onClick={this.submit}
          label="Add transaction"
        />
      </div>
    );
  }
}

export default LogTransaction;
