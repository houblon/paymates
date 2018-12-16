import React, { Component } from 'react';
import './LogTransaction.css';

class LogTransaction extends Component {
  state = {
    transactionDate: '',
    payer: '',
    action: '',
    recipient: '',
    amount: 0,
    proportions: '',
  }

  onChangeTransactionDate = (ev) => {
    this.setState({
      TransactionDate: ev.target.value,
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
    const formData = {
      transactionDate: this.state.transactionDate,
      payer: this.state.payer,
      action: this.state.action,
      recipient: this.state.recipient,
      amount: this.state.amount,
      proportions: this.state.proportions,
    };

    //
    // THIS IS WHERE THE UPDATE FUNCTION NEEDS TO GO!!!
    //
    fetch('/api/mongodb/households/5c15c80c2fb417300a289157', { // this route need to change
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
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
    fetch(`/api/mongodb/households/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          household: data
        })
      })
      .then(() =>{
        const formData = {
          transactionDate: this.state.transactionDate,
          payer: this.state.payer,
          action: this.state.action,
          recipient: this.state.recipient,
          amount: this.state.amount,
          proportions: this.state.proportions,
        };
        fetch('/api/mongodb/households/5c15c80c2fb417300a289157', { // this route need to change
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        })
        // .then(response => response.json())
        // .then(data => {
        //   console.log('Got this back', data);
  
        //   // Redirect to homepage
        //   // this.props.history.push('/');
        // });
      });

  }

  render() {
    return (
      <div className="LogTransaction">
        <h1>Log a new transaction</h1>
        <input
            name="Transaction date"
            placeholder="Enter transaction date"
            value={this.state.transactionDate}
            onChange={this.onChangeTransactionDate}
          />
        <br />
        <input
            name="Payer"
            placeholder="Who paid..."
            value={this.state.payer}
            onChange={this.onChangePayer}
          />
        <br />
        <button onClick={this.onChangeAction} value="paid bill">Paid Bill</button>
        <button onClick={this.onChangeAction} value="paid back">Paid Back</button>
        <input
            name="Recipient"
            placeholder="Who received the money..."
            value={this.state.recipient}
            onChange={this.onChangeRecipient}
          />
        <br />
        <input
            name="Amount"
            placeholder="Amount"
            value={this.state.amount}
            onChange={this.onChangeAmount}
          />
        <button onClick={this.submit}>Add transaction</button>
      </div>

    );
  }
}

export default LogTransaction;
