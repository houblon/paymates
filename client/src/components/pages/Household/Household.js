import React, { Component } from 'react';
import './Household.css';

import Button from '../../Button/Button.js';

class Household extends Component {
  state = {
    householdName: '',
    householdMembers: [],
    mongo: []
  }
  
  componentDidMount () {
    // const currentURL = window.location.href
    // let result = currentURL.substring(currentURL.lastIndexOf("/") + 1);
    // console.log(result);
    const id = this.props.match.params.id;
    console.log(id);
    fetch(`/api/household/${id}`)
    .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          mongo: data
        })
      });
  }
  

  mongoHouseholdsTest = (collectionName, objectId) => {
    fetch(`/api/mongodb/${collectionName}/${objectId}`) // /api/mongodb/:collectionName/:objectId/ 5c146f11e5fada39ca922968
      .then(response => response.json())
      .then(data => {
        console.log(`Got data back from /api/mongodb/${collectionName}/${objectId}`, data);
      });
  }

  render() {
    return (
      <div className="Create-Household">
        <h1>Household Report</h1>
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c146f11e5fada39ca922968')}
            label="GET Test household"
          />
          <Button onClick={() => this.mongoHouseholdsTest('households', '5c14196288ab5128ca0a5564')}
            label="GET Alice and Bob's House household"
          />
      </div>
    );
  }
}

export default Household;
