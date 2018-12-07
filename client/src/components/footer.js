import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import scatter from './imgs/scatter.PNG';
import logoBlue from './imgs/logoBlue.png';

import $ from "jquery";

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import dp from '../app.json';
import axios from 'axios';
var adminURL = dp['url'];
var apiId = dp['apiId'];

ScatterJS.plugins(new ScatterEOS());

// const network = { blockchain:'eos',
//                 protocol:'https',
//                 host:'proxy.eosnode.tools',
//                 port:443,
//                 chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }

const network = {
    blockchain: 'eos',
    protocol: 'https://cors-anywhere.herokuapp.com/http',
    host: '13.52.54.111',
    eosVersion: 'bf28f8bb',
    port: 8888,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    debug: false,
    verbose: false,
    latency: 200
}

// const eosNetwork = {
//     httpEndpoint: 'https://cors-anywhere.herokuapp.com/http://13.52.54.111:8888',
//     chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
//     keyProvider: '5JgoxYfndKYwQQNiEzkfAAXwvSu1FxZQsnHXNXr2myNAF5mJrgH'
// }



function handleClicks(e) {
    e.preventDefault();
    $('.signInPopup ').fadeOut();
}



class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            colors: [],
            logo: [],
            companyName: [],
            scatterConnect: true
        };

        this.handleClickss = this.handleClickss.bind(this);
    }

    componentDidMount() {

        fetch(adminURL + '/getColors/' + apiId)
            .then(response => response.json())
            .then(data => {
                if (data.logo === '') {
                    this.setState({ colors: '#0e9caf' }); this.setState({ logo: logoBlue });
                }
                else {
                    this.setState({ colors: data.theme_color });
                    this.setState({ logo: adminURL + '/images/byzantine/' + data.logo });
                    this.setState({ lightLogo: adminURL + '/images/byzantine/' + data.lightLogo });
                }
            }).catch(data => {
                this.setState({ colors: '#0e9caf' }); this.setState({ logo: logoBlue });
            });
            fetch(adminURL+'/getColors/'+apiId)
            .then(response => response.json())
            .then(data => {if(data.footerCopyright==='')
            {
                $('#copyrite').html('© Uberdex 2018. All Right Reserved.');
            }
            else
            {
                $('#copyrite').html(data.footerCopyright);
                $('#bottomss').html(data.footerBottom);
        
            }
            }).catch(data => {
                $('#copyrite').html('© Uberdex 2018. All Right Reserved.');
            });
            

    }

     async handleClickss(e) {
        e.preventDefault();
        let scatter = ScatterJS.scatter;
        scatter = scatter.isExtension ? window.ScatterJS.scatter : scatter;
        console.log(scatter);
        let connected = false
        scatter.connect("UberDEX").then(connect => {
            connected = connect;
            console.log(connected)
        });
        setTimeout(async () => {
           

            // If the user does not have Scatter or it is Locked or Closed this will return false;
            if (!connected) {
                return this.setState({scatterConnect: false});
            }

            // Check the scatter identity of the user
            const requiredFields = { accounts: [network] };
            let id = await scatter.getIdentity(requiredFields);

            const account = id.accounts.find(x => x.blockchain === 'eos');
            // const eosPriv = Eos(eosNetwork)
            // const exContract = await eosPriv.contract('exchange')
            // const ispkpaired = await exContract.ispkpaired(scatter.identity.accounts[0].name);
            // console.log("scatter: ", ispkpaired);

            const eosOptions = { expireInSeconds: 60 }

            this.props.updateScatterID(scatter, account)
            const eos = scatter.eos(network, Eos, eosOptions)
            console.log("Scatter eos: ", eos);
            $('.signInPopup ').fadeOut();
            let resp = await axios(`https://api.byzanti.ne/exbalance?account=${scatter.identity.accounts[0].name}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`);
            console.log(resp.data)
            this.props.updateBalance(resp.data);
        }, 1000);


    }

    render() {

        return (
            <div>
                <div className="footer">
                    <div className="container clearfix">
                        <img src={this.state.logo} className="darkF" alt=""  />
                        <img src={this.state.lightLogo} className="lightF" alt="" />
                        <p id="bottomss"></p>
                        <span id="copyrite"></span>
                        <ul>
                            <li><Link to="/about" className="link">About</Link></li>
                            <li><Link to="/user_agreement" className="link">User Agreement</Link></li>
                            <li><Link to="/contact" className="link">Contact</Link></li>
                            <li><Link to="/contact" className="link">Support</Link></li>
                            <li><Link to="/trade" className="link">How to Trade</Link></li>
                            <li><a href="/ldar" className="">LDAR</a></li>
                        </ul>
                    </div>
                </div>

                <div className="signInPopup">
                    <div className="inners">
                        <a href="/" className="cls" onClick={handleClicks}><i className="fa fa-times"></i></a>
                        <img src={scatter} alt=""  />
                        <a href="/" className="sgn" onClick={this.handleClickss}>Sign in via Scatter</a>
                        <p>Scatter allows convenient transactions without password</p>
                        {this.state.scatterConnect ? null : <p style={{color: 'red'}}>Please make sure that your Scatter app is opened first.</p>}
                    </div>
                </div>

            </div>
        )
    }
}

export default Footer;