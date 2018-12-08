import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './FindHousehold.css';
class FindHousehold extends Component {
  render() {
    return (
      <div className="FindHousehold">
        <header className="FindHousehold-header">
            <h1>How to find your household</h1>
            <p>In order to protect our user's privacy we do not offer a way to search for households. However, when your household was created you may have recieved an email with a link in it. Try searching your email for 'paymates'. Good luck!</p>
            <h2><Link to="/create-household/">Create a Household</Link></h2>
        </header>
      </div>
    );
  }
}

export default FindHousehold;
