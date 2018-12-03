import React, { Component } from 'react';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import data from './app.json';
import  Eos from 'eosjs';

import './App.css';

import { Layout, Content } from 'react-mdl';
var color = {background: data['theme_color']};

const network = { blockchain:'eos',
                protocol:'https',
                host:'proxy.eosnode.tools',
                port:443,
                chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }

// const network = {
//                   blockchain:'eos',
//                   protocol:'https://cors-anywhere.herokuapp.com/http',
//                   host:'13.52.54.111',
//                   eosVersion: 'bf28f8bb',
//                   port:8888,
//                   chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
//                   debug: false,
//                   verbose: false,
//                   latency: 200,
//                   sign: true
//               }


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [],
      scatterID: false,
      balance: false
    }
    this.updateScatterID = this.updateScatterID.bind(this);
    this.updateBalance = this.updateBalance.bind(this);

  }

  updateBalance(balArr) {
    let balance = {};
    balArr.forEach(x => {
      balance[x.symbol] = x.amount;
    })
    this.setState({balance});
    console.log(balance)

  }


  updateScatterID(id, account) {
    if(!id) {
      this.setState({scatterID: false});
      this.setState({scatterEOS: false})
      this.setState({account: false})
    } else {
      this.setState({scatterID: id});
      this.setState({scatterEOS: id.eos(network, Eos)});
      this.setState({account});
    }
  }

  
  render() {
    return (
      <div className="demo-big-content">
          <Layout>
              <Content>
                  <div className="page-content" />
                    <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                      <Header updateScatterID={this.updateScatterID} scatterID={this.state.scatterID} />
                    </div>
                  <Main scatterID={this.state.scatterID} scatterEOS={this.state.scatterEOS} balance={this.state.balance} account={this.state.account}/>
                  <Footer updateScatterID={this.updateScatterID} scatterID={this.state.scatterID} updateBalance={this.updateBalance}/>
              </Content>
          </Layout>
      </div>
    );
  }
}

export default App;

