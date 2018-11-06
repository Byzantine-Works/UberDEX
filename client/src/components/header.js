import React, {Component} from 'react';
import logo from './logoMain.png';
import logos from './logos.png';
import $ from "jquery";
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
ScatterJS.plugins( new ScatterEOS() );

const network = { blockchain:'eos',
                protocol:'https',
                host:'proxy.eosnode.tools',
                port:443,
                chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }

function handleClick(e) {
    e.preventDefault();
    $('.signInPopup ').fadeIn();
  }
  
function handleSignout(e){
    e.preventDefault();
     ScatterJS.scatter.forgetIdentity();
    window.location.reload();
}
  
class Header extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
          connected: false
        };
      }
      checkConnection() {

      }


      async componentDidMount() {
          try{
            const scatter = ScatterJS.scatter;
            await scatter.connect("UberDEX");
            const requiredFields = { accounts:[network] };
            // await scatter.getIdentity(requiredFields);
            console.log("scatter: ", scatter);
            await scatter.connect("UberDEX");
    
    
        // If the user does not have Scatter or it is Locked or Closed this will return false;
    
        // Check the scatter identity of the user
            const eosOptions = { expireInSeconds:60 }
        // console.log("window scatter: ", window.scatter.isExtension);
        // if(window.scatter.isExtension){
        //     scatter = window.scatter;
            let id = await scatter.getIdentity(requiredFields);
            console.log("id: ", id);
            const account = id.accounts.find(x => x.blockchain === 'eos');
            console.log("account: ", account);
    
            
        
        
        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        const eos = scatter.eos(network, Eos, eosOptions);
        if(scatter.identity){
            $('#signin').hide();
            $('#signout').css('display','inline-block');
            $('.bgs').html(scatter.identity.accounts[0].name);
        } else {
            $('#signin').css('display','inline-block');
            $('#signout').hide();
        }
    } catch(error) {

    }
    
        

      }


    render(){
       
        return(
            <div className="header ">
                <div className="container clearfix">
                    <div className="logo">
                        <a href="/" className="drk" ><img src={logos} className="App-logo" alt="logo" /></a>
                        <a href="/" className="lit"><img src={logo} className="App-logo" alt="logo" /></a>
                    </div>
                    <div className="menuSections">
                        <nav>
                            <ul>
                                <li><a href="/exchange/?opt=IQ">Exchange</a></li>
                                <li><a href="/market">Markets</a></li>
                                <li><a href="/contact">Supports</a></li>
                                <li id="signin"><a href="/"  onClick={handleClick}>Sign In</a></li>
                                <li id="signout"><a href="/"  onClick={handleSignout}>Sign out</a></li>
                                <li><a href="/" className="bgs">Get Started</a></li>
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