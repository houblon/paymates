import React, { Component } from 'react';
import './LogTransaction.css';
import Button from '../../Button/Button.js';
import Input from '../../Input/Input.js';

class LogTransaction extends Component {
  state = {
    date: '',
    payer_ID: '',
    payee: '',
    action: '',
    recipient_ID: '',
    amount: '',
    currency: 'USD',
    proportions: [],
    members: []
    // household: [
    //   {
    //     name: '',
    //     members: [
    //       {
    //         id: '',
    //         name: '',
    //       },
    //     ]
    //   },
    // ],
  }

  onChangeTransactionDate = (ev) => {
    this.setState({
      date: ev.target.value,
    });
  }

  onChangePayer = (ev) => {
    this.setState({
      payer_ID: ev.target.value,
    });
  }

  onChangePayee = (ev) => {
    this.setState({
      payee: ev.target.value,
    });
  }

  onChangeAction = (ev) => {
    this.setState({
      action: ev.target.value,
    });
  }

  onChangeRecipient = (ev) => {
    this.setState({
      recipient_ID: ev.target.value,
    });
  }

  onChangeAmount = (ev) => {
    this.setState({
      amount: ev.target.value,
    });
  }
  
  onChangeProportions = (ev) => {
    this.setState({
      proportions: ev.target.value,
    });
  }

  submit = () => {
    let formData = {}
    const id = this.props.match.params.id;
    if (this.state.action === "bill") {
      formData = {
      date: this.state.transactionDate,
      payer_ID: this.state.payer_ID,
      payee: this.state.payee,
      action: this.state.action,
      recipient_ID: this.state.recipient_ID,
      amount: this.state.amount,
      currency: this.state.currency,
      proportions: this.state.memberProportions
    }
    } else if (this.state.action === "reimbursement") {
      formData = {
      date: this.state.transactionDate,
      payer_ID: this.state.payer_ID,
      action: this.state.action,
      recipient_ID: this.state.recipient_ID,
      amount: this.state.amount,
      currency: this.state.currency
    }
  }
    console.log(formData);
    
    //
    // THIS IS WHERE THE UPDATE FUNCTION NEEDS TO GO!!!
    //
    fetch(`/api/households/${id}`, { // this route need to change
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
    // fetch('/api/households/5c15c80c2fb417300a289157', { // this route need to change
    //     method: 'PUT',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(formData),
    //   })
      .then(response => response.json())
      .then(data => {
        console.log('Got this back', data);

        // Redirect to homepage
        // this.props.history.push('/');
      });
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
    console.log(defaultProportions);
    
    // const memberProportions = memberNames.reduce(function(obj, itm) {
    //   obj[itm] = defaultProportion;
    //   return obj;
    // }
    return defaultProportions
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
          members: data[0].members
        }, () => {
          console.log(this.state.proportions)
          this.setState({
            proportions: this.setDefaultProportions(this.state.members)
          }, () => {
            console.log(this.state);
            
          })
        })
      })
      .then(() => {
        //const memberNames = this.state.household[0].members.map(member => member.name).sort();
        //console.log(memberNames);
        //const numMembers = memberNames.length;
        //const defaultProportion = 1 / numMembers;
        
        
        // this.setState({
        //   memberNames: memberNames,
        //   numMembers: numMembers,
        //   defaultProportion: defaultProportion,
        //   memberProportions: memberProportions,
        // })
      })
      // .then(() =>{
      //   const formData = {
      //     transactionDate: this.state.transactionDate,
      //     payer: this.state.payer,
      //     action: this.state.action,
      //     recipient: this.state.recipient,
      //     amount: this.state.amount,
      //     // proportions: this.state.proportions,
      //   };
      //   fetch(`/api/households/${id}`, { // this route need to change
      //     method: 'PUT',
      //     headers: {'Content-Type': 'application/json'},
      //     body: JSON.stringify(formData),
      //   })
      //   // .then(response => response.json())
      //   // .then(data => {
      //   //   console.log('Got this back', data);
  
      //   //   // Redirect to homepage
      //   //   // this.props.history.push('/');
      //   // });
      // })
      ;

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

        <h2>Household Name: {this.state.householdName}</h2>
        <h2>Household ID: {this.state.householdID}</h2>
        <h2>Who Paid: {this.state.payer_ID}</h2>
        {
          this.state.members.map(member => (
            <Button
              onClick={this.onChangePayer}
              value={member.id}
              label={member.name}
            />
          ))
        }
        {/* <Input
            name="Payer"
            placeholder="Who paid..."
            value={this.state.payer}
            onChange={this.onChangePayer}
          /> */}
        <br />

        <h2>Action type: {this.state.action}</h2>
        <button onClick={this.onChangeAction} value="bill">Paid Bill</button>
        <button onClick={this.onChangeAction} value="reimbursement">Paid Back</button>

        <h2>Reimbursement Recipient: {this.state.recipient_ID}</h2>
        {
          this.state.members.map(member => (
            <Button
              onClick={this.onChangeRecipient}
              value={member.id}
              label={member.name}
            />
          ))
        }
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
        <Button onClick={this.submit} label="Add transaction" />
        {
          this.state.memberNames ? (
            <div>
              {
                
                this.state.memberNames.map((member, index) => (
                  <p key={'member' + index}>{member}</p>
                  )
                )
              }
            </div>
          ) : null
        }
      </div>

    );
  }
}

export default LogTransaction;
