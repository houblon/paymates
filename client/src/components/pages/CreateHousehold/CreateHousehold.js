import React, { Component } from 'react';
import './CreateHousehold.css';

import Input from '../../Input/Input.js';
import Button from '../../Button/Button.js';

class CreateHousehold extends Component {
  state = {
    householdName: '',
    householdMembers: [
      {
        id: 1,
        name: 'Manny',
      },
      {
        id: 2,
        name: 'Moe',
      },
      {
        id: 3,
        name: 'Jack',
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
    const lastItem = this.state.householdMembers.length - 1;
    const name = this.state.householdMembers[lastItem].name;
    console.log(name);

    if (name !== '') {
      const newIndex = this.state.householdMembers.length + 1;
      this.setState({ householdMembers: this.state.householdMembers.concat([{ id: newIndex, name: '' }]) });
    } else {
      console.log('Please enter a name');
    }
    // const formData = {
    //   name: name
    // };
    // fetch('/api/members/', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(formData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Added a member, got this response:', data);

    //   // Redirect to blog
    //   // this.props.history.push('/');
    // });
  }

  onRemoveMember = (idx) => () => {
    this.setState({ householdMembers: this.state.householdMembers.filter((s, sidx) => idx !== sidx) });
  }

  onChangeDefaultCurrency = (ev) => {
    this.setState({
      defaultCurrency: ev.target.value,
    });
  }
  componentDidMount() {
    // console.log('componentDidMount');
  }

  submit = () => {
    console.log('submit function invoked')
    const formData = {
      name: this.state.householdName,
      members: this.state.householdMembers,
      defaultCurrency: this.state.defaultCurrency,
      transactions: []
    };

    let emptyMemberNameField = false;

    for (const member of this.state.householdMembers) {
      if (member.name === '') {
        emptyMemberNameField = true;
      }
    }

    // const newhouseholdMembers = this.state.householdMembers.map((member, state_index) => {
    //   if (index !== state_index) return member;
    //   return { ...member, name: ev.target.value };
    // });
    // this.setState({ householdMembers: newhouseholdMembers });

    if (emptyMemberNameField) {
      console.log('please enter member name');
    }

    if (this.state.householdName === '') {
      console.log('needs a household name');
    }

    if (this.state.householdMembers.length < 2) {
      console.log('must have at least 2 household members');
    }

    if (this.state.householdName !== '' &&
        this.state.householdMembers.length > 1) {
      fetch('/api/households/', {
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
  }

  mongoHouseholdsTest = (collectionName, objectId) => {
    fetch(`/api/${collectionName}/${objectId}`) // /api/mongodb/:collectionName/:objectId/ 5c146f11e5fada39ca922968
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
          className='household-input'
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
              className='household-input member-input'
              type='text'
              name={'member_' + String(index + 1)}
              placeholder={
                member.errorMessage ? (
                  member.errorMessage
                ) : (
                  `Member #${index + 1} name`
                )
              }
              value={member.name}
              onChange={this.onMemberNameChange(index)}
            />
            {
              // index > 1 ? (
              this.state.householdMembers.length > 2 ? (
                <Button
                  className='round_remove'
                  onClick={this.onRemoveMember(index)}
                  label='–'
                />
              ) : (null)
            }
            
            {/* <Button type="button" onClick={this.onRemoveMember(index)} className="button submit_on_white">-</Button> */}
          </div>
        ))}
          <Button 
            type="button" 
            onClick={this.onAddMember} 
            // className="submit_on_white"
            className="round_add member-add"
            // label="Add Another Member"
            label="+"
          />Add Another Member

          <br />
          <br />
          <Button onClick={this.submit}
            label="Add household"
            className="submit_on_white"
          />
          <br />
          <br />
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c146f11e5fada39ca922968')}
            label="GET Test household"
          />
          <br />
          <br />
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c14196288ab5128ca0a5564')}
            label="GET Alice and Bob's House household"
          />
      </div>
    );
  }
}

export default CreateHousehold;
