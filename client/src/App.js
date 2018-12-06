import React, { Component } from 'react';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import  Eos from 'eosjs';

import './App.css';

import { Layout, Content } from 'react-mdl';
import dp from './app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

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
      logo: [],
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
    //console.log(balance)

  }

  updateScatterID(id) {
    if(!id) {
      this.setState({scatterID: false});
      this.setState({scatterEOS: false})
    } else {
      this.setState({scatterID: id});
      this.setState({scatterEOS: id.eos(network, Eos)});
    }
  }

  
  componentDidMount() {
   
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color==='')
    {
        this.setState({colors:'#0e9caf'});
        this.setState({companyName:'UberDex'});
    }
    else
    {
        this.setState({companyName:data.companyName});
        this.setState({colors:data.theme_color});
        this.setState({logo:adminURL+'/images/byzantine/'+data.logo});
    }
    }).catch(data => {
        this.setState({colors:'#0e9caf'});
        this.setState({companyName:'UberDex'});
    });
    
}
  render() {
    return (
      <div className="demo-big-content">
       <div className="LdrChart" style={{'display':'none'}}>
                    <div className="container">
                        <div id="lineChart4" style={{"height":"400px"}}></div>
                    </div>
                </div>
                
          <Layout>
              <Content>
                  <div className="page-content" />
                    <div className="wellcomBanner background PreviousHeader" style={{'background': this.state.colors}}>
                      <Header updateScatterID={this.updateScatterID} scatterID={this.state.scatterID} />
                    </div>
                  <Main scatterID={this.state.scatterID} scatterEOS={this.state.scatterEOS} balance={this.state.balance}/>
                  <Footer updateScatterID={this.updateScatterID} scatterID={this.state.scatterID} updateBalance={this.updateBalance}/>
              </Content>
          </Layout>
      </div>
    );
  }
}

export default App;

