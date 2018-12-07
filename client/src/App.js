import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'

import './App.css';

// Pull in entry data from the entries JSON file
import entries from './entries.json';

import LandingPage from './components/pages/LandingPage/LandingPage.js';
import Blog from './components/pages/Blog/Blog.js';
import WriteArticle from './components/pages/WriteArticle/WriteArticle.js';




class App extends Component {
  componentDidMount () {
    // Uses filter to narrow down array into 4 individual player arrays, one for
    // each of the 4 Quidditch positions
    const jessePayments = entries.filter(p => p.payer === 'Jesse');
    const stevePayments = entries.filter(p => p.payer === 'Steve');
    const mariaPayments = entries.filter(p => p.payer === 'Maria');
    console.log(jessePayments)
    console.log(stevePayments)
    console.log(mariaPayments)
  }
  render() {
    return (
      <div className="App">
        <nav className="App-navigation">
          <h1 className="App-title">MERN Starter</h1>
          <Link to="/">Welcome</Link>
          <Link to="/blog/">Blog</Link>
          <Link to="/write/">Write Article</Link>
        </nav>

        <div className="App-mainContent">
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/blog/' component={Blog} />
            <Route exact path='/write/' component={WriteArticle} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default App;
