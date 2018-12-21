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
    valid_Proportions: true,
    valid_Date: {
      error_status: false,
      errors: ["Please pick a valid date."]
    },
    valid_payer_ID: {
      error_status: false,
      errors: ["Please tell us who paid."]
    },
    valid_recipient_ID: {
      error_status: null,
      errors: []
    },
    valid_action: {
      error_status: false,
      errors: ["You're logging a transcation. Choose a bill or reimbursement."]
    },
    valid_amount: {
      error_status: false,
      errors: ["The amount can't be blank. It can be zero just not blank. Also, letters aren't numbers so no letters."]
    },
    showErrors: "hide",
    currentErrors: [],
    submitAttempted: false
  }

  onPickDate = (date) => {
    const uts = new Date(date).getTime() / 1000;
    this.setState({
      // pickedDate: new Date('2018.12.23'),
      pickedDate: date,
      pickedDateUTS: uts,
      valid_Date: {
        error_status: true,
        errors: []
      }
    }, () => {
      if (this.state.submitAttempted === true) {
        this.refreshErrorList()
      }
    });
    
  }
  onChangePayer = (ev) => {
    this.setState({
      payer_ID: ev.value,
    }, () => {
      this.checkPayer()
    });
  }
  checkPayer = () => {
    if (this.state.payer_ID === this.state.recipient_ID) {
      this.setState({
        valid_payer_ID: {
          error_status: false,
          errors: ["The recipient and person sending the reimbursement match. No bueno. Also, you're pretty sneeky."]
        }
      })
    } else if (this.state.payer_ID === "") {
      this.setState({
        valid_payer_ID: {
          error_status: false,
          errors: ["Please tell us who paid."]
        }
      })
    } else {
      this.setState({
        valid_payer_ID: {
          error_status: true,
          errors: []
        }
      }, () => {
        if (this.state.submitAttempted === true) {
          this.refreshErrorList()
        }
      })
    }
  }
  onChangePayee = (ev) => {
    this.setState({
      payee: ev.target.value,
    });
  }
  onChangeAction = (ev) => {
    this.setState({
      action: ev.value,
      valid_action: {
        error_status: true,
        errors: []
      }
    }, () => {
      this.checkRecipient()
      if (this.state.submitAttempted === true) {
        this.refreshErrorList()
      }
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
      valid_recipient_ID: {
        error_status: null,
        errors: []
      }
    }, () => {
      this.checkRecipient()
    });
  }
  checkRecipient = () => {
    if (this.state.action === "") {
      this.setState({
        valid_recipient_ID: {
          error_status: null,
          errors: []
        }
      })
    } else if (this.state.recipient_ID === "" && this.state.action === "reimbursement") {
      this.setState({
        valid_recipient_ID: {
          error_status: false,
          errors: ["Please tell us who is being reimbursed."]
        }
      })
    } else if (this.state.recipient_ID != "" && this.state.action === "reimbursement") {
      console.log('hi');
      
      this.setState({
        valid_recipient_ID: {
          error_status: true,
          errors: []
        }
      }, () => {
        if (this.state.submitAttempted === true) {
          this.refreshErrorList()
        }
      })
    }
  }
  onChangeAmount = (ev) => {
    this.setState({
      amount: ev.target.value,
    }, () => {
      this.checkAmount()
    });
    if (this.state.submitAttempted === true) {
      this.refreshErrorList()
    }
  }
  checkAmount = () => {
    const val = Number(this.state.amount)
    const type = typeof(val)
    console.log(val);
    console.log(Number(this.state.amount));
    console.log(typeof(val));
    
    if (this.state.amount === "") {
      this.setState({
        valid_amount: {
          error_status: false,
          errors: ["The amount can't be blank. It can be zero just not blank. Also, letters aren't numbers so no letters."]
        }
      })
    } else if (type) {
      this.setState({
        valid_amount: {
          error_status: true,
          errors: []
        }
      })
    }
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
  validate = () => {
    if (this.state.valid_action.status === true &&
      this.state.valid_Date.status === true &&
      this.state.valid_payer_ID.status === true &&
      this.state.valid_recipient_ID.status === true &&
      this.state.valid_amount.status === true &&
      this.state.valid_Proportions.status === true)
      {
        return true
      } else {
        return this.buildErrorList()
      }
  }
  buildErrorList = () => {
    let errorList = []
    for (const item of Object.values(this.state)) {
      if (item.error_status === false) {
        console.log(item.error_status);
        errorList.push(item.errors[0])
      }
    }
    // for (const [key, value] of Object.entries(this.state)) {
    //   if (value.error_status === false) {
    //     console.log(value.error_status);
    //     errorList.push([[key], value.errors[0]])
    //   }
    // }
    return this.displayErrorList(errorList);
  }
  displayErrorList = (errorList) => {
    if (errorList.length > 0) {
    this.setState({
      showErrors: "display",
      currentErrors: errorList
    }, () => {
      return false
    })
    } else {
      this.setState({
        showErrors: "hide",
        currentErrors: []
      })
      return true
    }
  }
  refreshErrorList = () => {
    this.buildErrorList()
  }
  submit = () => {
    this.setState({
      submitAttempted: true
    }, () => {
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
              console.log(data);
              const householdID = this.state.householdID
              const url = '/household/' + householdID
              this.props.history.push(url);
            });
    }
    })
    
  }
  setDefaultProportions = (membersSummary) => {
    //console.log(membersSummary);
    let defaultProportions = []
    let memberCount = membersSummary.length
    for (const summary of membersSummary) {
      const memberProportion = {}
      //console.log(summary);
      memberProportion.member_ID = summary.id
      memberProportion.proportion = this.roundToOneDecimalPlace(Number(100/memberCount))
      //console.log(memberProportion);
      defaultProportions.push(memberProportion)
    }
    return defaultProportions
  }
  setProportions = (membersSummary) => {
    //console.log(membersSummary);
    let newSummary = []
    let memberCount = membersSummary.length
    for (const summary of membersSummary) {
      //console.log(summary);
      summary.proportion = this.roundToOneDecimalPlace(Number(100/memberCount))
      //console.log(memberProportion);
      newSummary.push(summary)
    }
    //console.log(newSummary);
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
      members: newSummary,
      valid_Proportions: true
    })
  }
  componentDidMount () {  
    // const currentURL = window.location.href
    // let result = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    // console.log(result);
    const id = this.props.match.params.id;
    //console.log(id);
    fetch(`/api/households/${id}`)
      .then(response => response.json())
      .then(data => {
        //console.log(data);
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
        
        <div className=''>
        <h2>Which are you logging?</h2>
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
        <h2>When exactly?</h2>
        <div className='transaction-date-container'>
        <div className='transaction-date'>
          <DatePicker
            placeholderText="Enter transaction date"
            selected={this.state.pickedDate}
            onChange={this.onPickDate}
            className="react-datepicker__input"
          />
        </div>
        </div>
        <div className=''>
          <h2>Who paid...?</h2>
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
        
        <div className={this.state.reimbursementShowBool}>
          <h2>Reimbursement Recipient:</h2>
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
        <h2>What did you pay for?</h2>
          <div className="transaction-payee">
            <Input
              name="Business name"
              placeholder="Paid what bill..."
              value={this.state.payee}
              onChange={this.onChangePayee}
            />
          </div>
        </div>
        <h2>How much?</h2>
        <div className="transaction-amount">
          <label>$</label>
          <Input
            name="Amount"
            placeholder="Amount"
            value={this.state.amount}
            onChange={this.onChangeAmount}
                type="number"
                step=".1"
                min="0"
          />
        </div>
        <div className={this.state.billShowBool}>
        <h2>How do you want to split the bill?</h2>
        {
          this.state.members.map(member => (
            <div className='transaction-proportion'>
              <label>{member.name}'s proportion:</label>
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
          <div className="transaction-proportion">
              <p>...were you raised in a barn!<br />Proportions add up to 100<br />;)</p>
              <Button
                className="submit_on_white"
                onClick={this.resetProportions}
                label="Reset Proportions"
              />
            </div>
          </div>
        }
        </div>
        <div className={this.state.showErrors}>
        <h1 className="transaction-error-alert">Fix the following:</h1>
        {
          this.state.currentErrors.map(error => (
            <p className="transaction-error-alert">{error}</p>
          ))
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
