import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './LandingPage.css';
import Button from '../../Button/Button';
class LandingPage extends Component {
  componentDidMount () {
    document.getElementById('root').classList.add('snow', 'home');
  }

  removeRootClasses = () => {
    document.getElementById('root').classList.remove('snow', 'home');
  }

  render() {
    return (
      <div className="LandingPage">
        <header className="LandingPage-header snow">
            <h1>paymates is where friends stay friends... or not.</h1>
            <h2>
              <Link to="/create-household/">
                <Button
                  label="Create a Household"
                  className="submit_on_black"
                  onClick={this.removeRootClasses}
                />
              </Link>
            </h2>
            <p>
              <Link to="/find-household/">
                <Button
                  label="Find your Household"
                  className="submit_on_black"
                  onClick={this.removeRootClasses}
                />
              </Link>
            </p>
        </header>
        <div class="cheer">
          <img src="https://media.giphy.com/media/1r8SvvPrDqVyRYk8yK/giphy.gif" />
        </div>
      </div>
    );
  }
}

export default LandingPage;
