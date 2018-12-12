import React, { Component } from 'react';
import './CreateHousehold.css';

import Input from '../../Input/Input.js';
import Button from '../../Button/Button.js';

class CreateHousehold extends Component {
  state = {
    householdName: '',
    householdMembers: [],
    defaultCurrency: '',
  }
  onChangeHouseholdName = (ev) => {
    this.setState({
      householdName: ev.target.value,
    });
  }
  onChangeHouseholdMembers = (ev) => {
    this.setState({
      householdMembers: ev.target.value,
    });
  }
  onChangeDefaultCurrency = (ev) => {
    this.setState({
      defaultCurrency: ev.target.value,
    });
  }
  componentDidMount() {
    // console.log('doing thing');
    // fetch('/api/mongodb/blogposts/')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Got data back', data);
    //     this.setState({
    //       blogPosts: data,
    //     });
    //   });
  }

  submit = () => {
    console.log('submit form')
    const formData = {
      name: this.state.householdName,
      members: this.state.householdMembers,
      defaultCurrency: this.state.defaultCurrency
    };

    fetch('/api/mongodb/households/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Got this back', data);

        // Redirect to blog
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div className="Create-Household">
        <h1>Create a new household</h1>
        <Input
            name="Household Name"
            placeholder="Enter your household name"
            value={this.state.householdName}
            onChange={this.onChangeHouseholdName}
          />
        <br />
        <Input
            name="Household Members"
            placeholder="Who's in the household"
            value={this.state.householdMembers}
            onChange={this.onChangeHouseholdMembers}
          />
        <br />
        <Input
            name="Currency"
            placeholder="What currency"
            value={this.state.defaultCurrency}
            onChange={this.onChangeDefaultCurrency}
          />
          <br />
          <Button onClick={this.submit}
            label="Add household"
          />
      </div>
    );
  }
}

export default CreateHousehold;
