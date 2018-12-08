import React, { Component } from 'react';
import './CreateHousehold.css';

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
  render() {
    return (
      <div className="Create-Household">
        <h1>Create a new household</h1>
        <input
            name="Household Name"
            placeholder="Enter your household name"
            value={this.state.householdName}
            onChange={this.onChangeHouseholdName}
          />
        <br />
        <input
            name="Household Members"
            placeholder="Who's in the household"
            value={this.state.householdMembers}
            onChange={this.onChangeHouseholdMembers}
          />
        <br />
        <input
            name="Currency"
            placeholder="What currency"
            value={this.state.defaultCurrency}
            onChange={this.onChangeDefaultCurrency}
          />
      </div>
    );
  }
}

export default CreateHousehold;
