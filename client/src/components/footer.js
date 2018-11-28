import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import scatter from './imgs/scatter.PNG';
import logoBlue from './imgs/logoBlue.png';
import logoBlueh from './imgs/logoBlueh.png';
import $ from "jquery";

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
// import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs';

ScatterJS.plugins( new ScatterEOS() );

const network = { blockchain:'eos',
                protocol:'https',
                host:'proxy.eosnode.tools',
                port:443,
                chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }

// const network = {
//                     blockchain:'eos',
//                     protocol:'https://cors-anywhere.herokuapp.com/http',
//                     host:'13.52.54.111',
//                     eosVersion: 'bf28f8bb',
//                     port:8888,
//                     chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
//                     debug: false,
//                     verbose: false,
//                     latency: 200
//                 }




function handleClicks(e) {
    e.preventDefault();
    $('.signInPopup ').fadeOut();
  }
  

class Footer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            logo: [],
            companyName: [],
        };
        console.log("props: ", props);
        this.handleClickss = this.handleClickss.bind(this);
        // this.setState = props.setState.bind(this);
    }

    async handleClickss(e){
        e.preventDefault();
        let scatter = ScatterJS.scatter;
        scatter = scatter.isExtension ? window.ScatterJS.scatter : scatter;
        console.log(scatter);
        let connected = await scatter.connect("UberDEX");
        console.log(connected)
    
    
        // If the user does not have Scatter or it is Locked or Closed this will return false;
        if(!connected) return false;
    
        // Check the scatter identity of the user
        const requiredFields = { accounts:[network] };
        let id = await scatter.getIdentity(requiredFields);

        const account = id.accounts.find(x => x.blockchain === 'eos');
    
        const eosOptions = { expireInSeconds:60 }

        this.props.updateScatterID(scatter)
        const eos = scatter.eos(network, Eos, eosOptions)
        console.log("Scatter eos: ", eos);
        $('.signInPopup ').fadeOut();
        
        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        // const eos = scatter.eos(network, Eos, eosOptions);
        // if(scatter.identity){
            
        //     $('#signin').hide();
        //     $('#signout').css('display','inline-block');
        //     $('.bgs').html(scatter.identity.accounts[0].name);
        //    
        // } else {
        //     $('#signin').css('display','inline-block');
        //     $('#signout').hide();
        // }
    }


componentDidMount() {
   
    fetch('https://uberdex-admin.herokuapp.com/getColors')
    .then(response => response.json())
    .then(data => {if(data.logo=='')
    {
          this.setState({colors:'#0e9caf'});this.setState({logo:logoBlue});
    }
    else
    {
        this.setState({colors:data.theme_color});
         this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo});
    }
    }).catch(data => {
         this.setState({colors:'#0e9caf'});this.setState({logo:logoBlue});
    });
    
    fetch('https://uberdex-admin.herokuapp.com/getColors')
    .then(response => response.json())
    .then(data => {if(data.companyName=='')
    {
        this.setState({companyName:'UberDex'});
    }
    else
    {
        this.setState({companyName:data.companyName});
    }
    }).catch(data => {
        this.setState({companyName:'UberDex'});
    });

}

    render(){
       
        return(
            <div>
                <div className="footer">
                    <div className="container clearfix">
                        <img src={this.state.logo} className="darkF" />
                        <img src={this.state.logo} className="lightF"/>
                        <p>Cryptocurrency investment is subject to high market risk, please make your investments cautiously.</p>
                        <span>© {this.state.companyName} 2018. All Right Reserved.</span>
                        <ul>
                            <li><Link to="/about" className="link">About</Link></li>
                            <li><Link to="/user_agreement" className="link">User Agreement</Link></li>
                            <li><Link to="/contact" className="link">Contact</Link></li>
                            <li><Link to="/contact" className="link">Support</Link></li>
                            <li><Link to="/trade" className="link">How to Trade</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="signInPopup">
                    <div className="inners">
                        <a href="#" className="cls"  onClick={handleClicks}><i className="fa fa-times"></i></a>
                        <img src={scatter} />
                        <a href="#" className="sgn" onClick={this.handleClickss}>Sign in via Scatter</a>
                        <p>Scatter allows convenient transactions without password</p>
                    </div>
                </div>

            </div>
        )
    }
}

export default Footer;