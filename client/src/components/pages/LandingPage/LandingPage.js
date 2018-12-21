import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './LandingPage.css';
import Button from '../../Button/Button';
class LandingPage extends Component {
  render() {
    return (
      <div className="LandingPage snow">
        <header className="LandingPage-header snow">
            <h1>paymates is where friends stay friends... or not.</h1>
            <h2>
              <Link to="/create-household/">
                <Button
                  label="Create a Household"
                  className="submit_on_black"
                />
              </Link>
            </h2>
            <p>
              <Link to="/find-household/">
                <Button
                  label="Find your Household"
                  className="submit_on_black"
                />
              </Link>
            </p>
        </header>
      </div>
    );
  }
}

export default LandingPage;
