import React, { Component } from 'react';
import logo from './logoMain.png';
import logos from './logos.png';
import $ from "jquery";
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import data from '../app.json';
import { Link } from 'react-router-dom';
ScatterJS.plugins(new ScatterEOS());

// const network = {
//     blockchain: 'eos',
//     protocol: 'https',
//     host: 'proxy.eosnode.tools',
//     port: 443,
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
// }

const network = {
    blockchain:'eos',
    protocol:'http',
    host:'13.52.54.111',
    eosVersion: 'bf28f8bb',
    port:8888,
    chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    debug: false,
    verbose: false,
    latency: 200
}

console.log(data);
var logoUrl = '/img/' + data['logo'];


function handlePublic(e) {
    e.preventDefault();
    var scatter = ScatterJS.scatter;
    //alert(scatter.identity.publicKey);
    console.log(scatter.identity);
}

function handleClick(e) {
    e.preventDefault();
    $('.signInPopup ').fadeIn();
}


class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tricker: [],
            connected: false
        };

        this.handleSignout = this.handleSignout.bind(this);
    }
    handleSignout(e) {
        e.preventDefault();
        ScatterJS.scatter.forgetIdentity();
        this.props.updateScatterID(false);
        console.log(this.props.scatterID);
        // $('#signin').css('display', 'inline-block');
        // $('#signout').hide();
        // $('.bgs').html("Get started");
    }




    async componentDidMount() {
            console.log(this.props.scatterID)
    
            if (this.props.scatterID) {
                const scatter = ScatterJS.scatter;;
                const requiredFields = { accounts: [network] };
                let id = await scatter.getIdentity(requiredFields);
                console.log("id: ", id);
                console.log(scatter.identity.accounts[0].name)
                const account = id.accounts.find(x => x.blockchain === 'eos');
                console.log(scatter.identity)
                $('#signin').hide();
                $('#signout').css('display', 'inline-block');
                $('.bgs').html(scatter.identity.accounts[0].name);
            } else {
                $('#signin').css('display', 'inline-block');
                $('#signout').hide();
            }
    }



    render() {
        console.log("this.props: ", this.props)


        return (
            <div className="header ">
                <div className="container clearfix">
                    <div className="logo">
                        <Link to="/"><img src={logoUrl} className="App-logo" alt="logo" /></Link>
                    </div>
                    <div className="menuSections">
                        <nav>
                            <ul>
                                <li><Link to="/exchange/?opt=IQ">Exchange</Link></li>
                                <li><Link to="/market">Markets</Link></li>
                                <li><Link to="/contact">Supports</Link></li>
                                {this.props.scatterID ? 
                                    <span>
                                        <li id="signout"><a href="/" onClick={this.handleSignout}>Sign out</a></li>
                                        <li><Link to="/account" className="bgs">{this.props.scatterID.identity.accounts[0].name}</Link></li>
                                    </span>
                                :
                                    <span>
                                        <li id="signin"><a href="/" onClick={handleClick}>Sign In</a></li>
                                        <li><a className="bgs" onClick={handlePublic}>Get Started</a></li>
                                    </span>
                            }
                            </ul>
                        </nav>
                        <div className="othersOptions">
                            <a href="/" className="fullscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                            <a href="/" className="smallscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                            <a href="#" className="light"><i className="fa fa-lightbulb"> </i></a>
                            <a href="#" className="dark"><i className="fa fa-lightbulb"> </i></a>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;