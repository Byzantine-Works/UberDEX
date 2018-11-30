import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Datafeed from './TVChartContainer/api/index';
import logoss from './logo_main.png';
import logos from './logos.png';
import $ from "jquery";

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

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


function handlelight(e)
  {
      
    $('.lightT').css('display', 'none');
    $('.darkt').css('display', 'inline-block');
    $('body').removeClass('darkVersion');
    $('body').addClass('lightVersion');
    $('.demo-big-content').removeClass('darkVersion');
  }


  function handledark(e)
  {
    $('.darkt').css('display', 'none');
    $('.lightT').css('display', 'inline-block');
    $('body').removeClass('lightVersion');
    $('body').addClass('darkVersion');
  }
  

function handlePublic(e){
    e.preventDefault();
    var scatter = ScatterJS.scatter;
    //alert(scatter.identity.publicKey);
    console.log(scatter.identity);
}

function handleClick(e) {
    e.preventDefault();
    $('.signInPopup ').fadeIn();
}

const tryRequire = (path) => {
    try {
     return require(`${path}`);
    } catch (err) {
     return null;
    }
  };


class Header extends Component {

    constructor(props) {
        super(props);

        
    this.state = {
        colors: [],
        logo: [],
    };

        this.handleSignout = this.handleSignout.bind(this);
    }
    handleSignout(e) {
        e.preventDefault();
        ScatterJS.scatter.forgetIdentity();
        this.props.updateScatterID(false);
        // $('#signin').css('display', 'inline-block');
        // $('#signout').hide();
        // $('.bgs').html("Get started");
    }




    async componentDidMount() {

        fetch(adminURL+'/getColors/'+apiId)
        .then(response => response.json())
        .then(data => {if(data.logo=='')
        {
              this.setState({colors:'#0e9caf'});this.setState({logo:logoss});
        }
        else
        {
            this.setState({colors:data.theme_color});
            $('#logoImg').attr('src',adminURL+'/images/byzantine/'+data.logo);
        }
        }).catch(data => {
             this.setState({colors:'#0e9caf'});this.setState({logo:logoss});
        });
       
    
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


render(){
    const { logo } = this.state;   
    
        return(
            <div className="header ">
                <div className="container clearfix">
                    <div className="logo">
                        <Link to="/" className="link"><img src={logoss} className="App-logo" id="logoImg" alt="" /></Link>
                    </div>
                    <div className="menuSections">
                        <nav>
                            <ul>
                                <li><Link to="/exchange/?opt=IQ" className="link">Exchange</Link></li>
                                <li><Link to="/market" className="link">Markets</Link></li>
                                <li><Link to="/contact" className="link">Supports</Link></li>
                                {this.props.scatterID ?
                                <span>
                                    <li id="signout"><a href="/"  onClick={this.handleSignout}>Sign out</a></li>
                                    <li><a href="/" className="bgs"  onClick={handlePublic}>{this.props.scatterID.identity.accounts[0].name}</a></li>
                                </span> :
                                <span>
                                    <li id="signin"><a href="/"  onClick={this.handleClick}>Sign In</a></li>
                                    <li><a href="/" className="bgs"  onClick={handlePublic}>Get Started</a></li>
                                </span>
                                }
                            </ul>
                        </nav>
                        <div className="othersOptions">
                            <a href="/" className="fullscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                            <a href="/" className="smallscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                            <a href="#" className="lightT" onClick={handlelight}><i className="fa fa-lightbulb"> </i></a>
                            <a href="#" className="darkt" onClick={handledark}><i className="fa fa-lightbulb"> </i></a>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;