import React, {Component} from 'react';
import logo from './logoMain.png';
import logos from './logos.png';
import $ from "jquery";
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

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