import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './FindHousehold.css';
import Button from '../../Button/Button';
class FindHousehold extends Component {
  removeRootClasses = () => {
    document.getElementById('root').classList.remove('snow', 'home');
  }

  componentDidMount() {
    this.removeRootClasses();
  }

  render() {
    return (
      <div className="FindHousehold">
        <header className="FindHousehold-header">
            <h1>How to find your household</h1>
              <p>In order to protect our users' privacy, we do not offer a way to search for households. However, when your household was created, you may have received an email with a link in it. Try searching your email for 'paymates'. Good luck!</p>
            <h2>
              <Link to="/create-household/">
                <Button
                  label="Create a Household"
                  className="submit_on_black"
                />
              </Link>
            </h2>
        </header>
      </div>
    );
  }
}

export default FindHousehold;
