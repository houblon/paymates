import React, { Component } from 'react';
import './LogTransaction.css';
import Button from '../../Button/Button.js';
import Input from '../../Input/Input.js';
import SelectList from 'react-widgets/lib/SelectList';
import { Link } from 'react-router-dom'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class LogTransaction extends Component {
  state = {
    reimbursementShowBool: 'hide',
    billShowBool: 'hide',
    // transactionDate: '',
    payer_ID: '',
    payee: '',
    action: '',
    recipient_ID: '',
    amount: '',
    currency: 'USD',
    proportions: [],
    members: [],
    valid_Proportions: true
  }

  onPickDate = (date) => {
    const uts = new Date(date).getTime() / 1000;
    this.setState({
      // pickedDate: new Date('2018.12.23'),
      pickedDate: date,
      pickedDateUTS: uts,
    });
  }
  // onChangeTransactionDate = (ev) => {
  //   this.setState({
  //     transactionDate: ev.target.value,
  //   });
  // }
  onChangePayer = (ev) => {
    this.setState({
      payer_ID: ev.value,
    });
  }
  onChangePayee = (ev) => {
    this.setState({
      payee: ev.target.value,
    });
  }
  onChangeAction = (ev) => {
    this.setState({
      action: ev.value,
    });

    if (ev.value === 'bill') {
      this.setState({
        reimbursementShowBool: 'hide',
        billShowBool: '',
        recipient_ID: '',
      });  
    } else {
      this.setState({
        reimbursementShowBool: '',
        billShowBool: 'hide',
        payee: '',
      });
    }
  }
  onChangeRecipient = (ev) => {
    this.setState({
      recipient_ID: ev.value,
    });
  }
  onChangeAmount = (ev) => {
    this.setState({
      amount: ev.target.value,
    });
  }
  buildFormData = () => {
    let formData = {
      date: this.state.pickedDateUTS,
      payer_ID: this.state.payer_ID,
      action: this.state.action,
      amount: this.state.amount,
      currency: this.state.currency,
    }

    if (this.state.action === "bill") {
      formData.payee = this.state.payee;
      formData.proportions = this.state.proportions;
      console.log("Its a bill");
      console.log("Inside bill formData:", formData);
    }

    if (this.state.action === "reimbursement") {
      formData.recipient_ID = this.state.recipient_ID;
      console.log("Its a reimbursement");
      console.log("Inside reim formData:", formData);
    }


    // if (this.state.action === "bill") {
    //     formData = {
    //     date: this.state.transactionDate,
    //     date: this.state.pickedDateUTS,
    //     payer_ID: this.state.payer_ID,
    //     payee: this.state.payee,
    //     action: this.state.action,
    //     amount: this.state.amount,
    //     currency: this.state.currency,
    //     proportions: this.state.proportions
    //   }
    //   console.log("Its a bill");
    //   console.log("Inside bill formData: ");
    //   console.log(formData);
    // } else if (this.state.action === "reimbursement") {
    //     formData = {
    //     date: this.state.transactionDate,
    //     date: this.state.pickedDateUTS,
    //     payer_ID: this.state.payer_ID,
    //     action: this.state.action,
    //     recipient_ID: this.state.recipient_ID,
    //     amount: this.state.amount,
    //     currency: this.state.currency
    //   }
    //   console.log("Its a reimbursement");
    //   console.log("Inside reim formData: ");
    //   console.log(formData);
    // }
    console.log("Built formData");
    // console.log(formData);
    
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
                console.log('Sent form data. Got this back', data);
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
      memberProportion.proportion = this.roundToOneDecimalPlace(Number(100/memberCount))
      console.log(memberProportion);
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
      summary.proportion = this.roundToOneDecimalPlace(Number(100/memberCount))
      //console.log(memberProportion);
      newSummary.push(summary)
    }
    console.log(newSummary);
    return newSummary
  }
  roundToOneDecimalPlace = (num) => {
    return Math.round(num * 10) / 10;
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
    this.checkProportions()
  }

  sumProportions = () => {
    const membersSummary = this.state.members
    let proportionsSum = 0
    for (const summary of membersSummary) {
      proportionsSum += Number(summary.proportion)
      //console.log(proportionsSum);
    }
    return proportionsSum
  }
  checkProportions = () => {
    const proportionsSum = this.sumProportions()
    //console.log(proportionsSum);
    if (proportionsSum === 100) {
      console.log("proportions sum is exactly 100%" + proportionsSum);
      this.setState({
        valid_Proportions: true
      })
    } else if (proportionsSum < 100 && proportionsSum >= 99.9) {
      console.log("proportions sum is 99.9% or better" + proportionsSum);
      this.setState({
        valid_Proportions: true
      })
    } else {
      this.setState({
        valid_Proportions: false
      })
    } 
  }
  resetProportions = () => {
    const newSummary = this.setProportions(this.state.members)
    this.setState({
      members: newSummary
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
        <h1>Log a New Transaction</h1>
        <h3>
          <Link to={"/household/" + this.state.householdID}>
            <Button
              label="Back to Household Report"
              className="submit_on_white"
            />
          </Link>
        </h3>
        <div className='transaction-date'>
          <DatePicker
            placeholderText="Enter transaction date"
            selected={this.state.pickedDate}
            onChange={this.onPickDate}
            className="react-datepicker__input"
          />
        </div>
        <div className=''>
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
        </div>
        <div className=''>
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
        </div>
        <div className={this.state.reimbursementShowBool}>
          <h2>Reimbursement Recipient: {this.state.recipient_ID}</h2>
          {
            this.state.members.map(member => (
              member.id !== this.state.payer_ID ? (
                <SelectList
                  data={
                    [
                      {
                        value: member.id,
                        label: member.name
                      }
                    ]

                  }
                  name='recipient'
                  onChange={this.onChangeRecipient}
                  textField='label'
                  value={this.state.recipient_ID}
                  valueField='value'
                />
              ) : null
            ))
          }
        </div>
        <div className={this.state.billShowBool}>
          <Input
            name="Business name"
            placeholder="Paid what bill..."
            value={this.state.payee}
            onChange={this.onChangePayee}
          />
        </div>
        <div className=''>
          <Input
            name="Amount"
            placeholder="Amount"
            value={this.state.amount}
            onChange={this.onChangeAmount}
          />
        </div>
        <div className={this.state.billShowBool}>
        {
          this.state.members.map(member => (
            <div>
              <label>{member.name}'s proportion of the bill: {member.id}</label>
            <Input
              name={member.name + "'s proportion"}
              placeholder={member.name + "'s proportion"}
              id={member.id} // Using the ID parameter for passing ID to function. Asking Michael / Maddy about best practices on this.
              value={member.proportion} // How do I add a '%' sign after the value without breaking validation?
              onChange={this.onChangeProportion}
              type="number"
              step=".1"
              max="100"
              min="0"
            />
            </div>
          ))
        }
        {
          this.state.valid_Proportions ? null :
          <div className="transaction-alert">
            <p>The proportions do not add up to 100%. Please correct.</p>
            <Button
              className="submit_on_white"
              onClick={this.resetProportions}
              label="Reset Proportions"
            />
          </div>
        }
        </div>
        <div className=''>
          <Button
            className="submit_on_white"
            onClick={this.submit}
            label="Add This Transaction"
          />
        </div>
      </div>
    );
  }
}

export default LogTransaction;
