import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './LandingPage.css';
class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage">
        <header className="LandingPage-header">
            <h1>paymates is where friends stay friends... or not.</h1>
            <h2><Link to="/create-household/">Create a Household</Link></h2>
            <p><Link to="/find-household/">Find your Household</Link></p>
        </header>
      </div>
    );
  }
}

export default LandingPage;
