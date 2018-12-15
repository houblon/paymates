import React, { Component } from 'react';
import './CreateHousehold.css';

import Input from '../../Input/Input.js';
import Button from '../../Button/Button.js';

class CreateHousehold extends Component {
  state = {
    householdName: '',
    householdMembers: [
      {
        position: 1,
        name: '',
      }
    ],
    defaultCurrency: 'USD',
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

  onMemberNameChange = (index) => (ev) => {
    const newhouseholdMembers = this.state.householdMembers.map((member, state_index) => {
      if (index !== state_index) return member;
      return { ...member, name: ev.target.value };
    });
    
    this.setState({ householdMembers: newhouseholdMembers });
  }

  onAddMember = () => {
    const newIndex = this.state.householdMembers.length + 1;
    this.setState({ householdMembers: this.state.householdMembers.concat([{ position: newIndex, name: '' }]) });

    const lastItem = this.state.householdMembers.length - 1;
    const name = this.state.householdMembers[lastItem].name;
    console.log(name);
    const formData = {
      name: name
    };
    fetch('/api/mongodb/members/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Added a member, got this response:', data);

      // Redirect to blog
      // this.props.history.push('/');
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

  mongoHouseholdsTest = (collectionName, objectId) => {
    fetch(`/api/mongodb/${collectionName}/${objectId}`) // /api/mongodb/:collectionName/:objectId/ 5c146f11e5fada39ca922968
      .then(response => response.json())
      .then(data => {
        console.log(`Got data back from /api/mongodb/${collectionName}/${objectId}`, data);
        // this.setState({
        //   blogPosts: data,
        // });
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
        {/* <br />
        <Input
            name="Household Members"
            placeholder="Who's in the household"
            value={this.state.householdMembers}
            onChange={this.onChangeHouseholdMembers}
          /> */}
        {/* <br /> */}
        {/* <Input
            type="text"
            name="Currency"
            placeholder="What currency"
            value={this.state.defaultCurrency}
            onChange={this.onChangeDefaultCurrency}
          /> */}

        {this.state.householdMembers.map((member, index) => (
          <div className="member" key={String(index)}>
            <Input
              type="text"
              name={'member_' + String(index + 1)}
              placeholder={`Member #${index + 1} name`}
              value={member.name}
              onChange={this.onMemberNameChange(index)}
            />
            {/* <button type="button" onClick={this.onRemoveMember(index)} className="small">-</button> */}
          </div>
        ))}
        <button type="button" onClick={this.onAddMember} className="small">Add Another Member</button>


          <br />
          <Button onClick={this.submit}
            label="Add household"
          />
          <br />
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c146f11e5fada39ca922968')}
            label="GET Test household"
          />
          <br />
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c14196288ab5128ca0a5564')}
            label="GET Alice and Bob's House household"
          />
      </div>
    );
  }
}

export default CreateHousehold;
