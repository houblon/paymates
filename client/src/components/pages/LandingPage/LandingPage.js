import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './LandingPage.css';
class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage">
        <header className="LandingPage-header">
            <h1>Paymates</h1>
            <h2>Where friends stay friends... or not.</h2>
            <h2><Link to="/create-household/">Create a Household</Link></h2>
            <h2><Link to="/find-household/">Find your Household</Link></h2>
        </header>
      </div>
    );
  }
}

export default LandingPage;
