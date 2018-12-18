import React, { Component } from 'react';
import './LogTransaction.css';
import Button from '../../Button/Button.js';
import Input from '../../Input/Input.js';

class LogTransaction extends Component {
  state = {
    transactionDate: '',
    payer: '',
    action: '',
    recipient: '',
    amount: '',
    proportions: '',
    household: [
      {
        name: '',
        members: [
          {
            id: '',
            name: '',
          },
        ]
      },
    ],
  }

  onChangeTransactionDate = (ev) => {
    this.setState({
      transactionDate: ev.target.value,
    });
  }

  onChangePayer = (ev) => {
    this.setState({
      payer: ev.target.value,
    });
  }

  onChangeAction = (ev) => {
    this.setState({
      action: ev.target.value,
    });
  }

  onChangeRecipient = (ev) => {
    this.setState({
      recipient: ev.target.value,
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
    const id = this.props.match.params.id;
    const formData = {
      date: this.state.transactionDate,
      payer_ID: this.state.payer,
      action: this.state.action,
      recipient_ID: this.state.recipient,
      amount: this.state.amount,
      proportions: this.state.memberProportions,
    };
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
          household: data
        })
      })
      .then(() => {
        const memberNames = this.state.household[0].members.map(member => member.name).sort();
        console.log(memberNames);
        const numMembers = memberNames.length;
        const defaultProportion = 1 / numMembers;
        const memberProportions = memberNames.reduce(function(obj, itm) {
          obj[itm] = defaultProportion;
          return obj;
        }, {});
        this.setState({
          memberNames: memberNames,
          numMembers: numMembers,
          defaultProportion: defaultProportion,
          memberProportions: memberProportions,
        })
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
        <Input
            name="Payer"
            placeholder="Who paid..."
            value={this.state.payer}
            onChange={this.onChangePayer}
          />
        <br />
        <button onClick={this.onChangeAction} value="paid bill">Paid Bill</button>
        <button onClick={this.onChangeAction} value="paid back">Paid Back</button>
        <Input
            name="Recipient"
            placeholder="Who received the money..."
            value={this.state.recipient}
            onChange={this.onChangeRecipient}
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
