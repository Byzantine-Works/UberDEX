import React, {Component} from 'react';
import logo from './logo_main.png';
import logos from './logos.png';
import $ from "jquery";

function handleClick(e) {
    e.preventDefault();
    $('.signIn_popup ').fadeIn();
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
                    <div className="menu_sections">
                        <nav>
                            <ul>
                                <li><a href="/exchange">Exchange</a></li>
                                <li><a href="/market">Markets</a></li>
                                <li><a href="/support">Supports</a></li>
                                <li><a href="/"  onClick={handleClick}>Sign In</a></li>
                                <li><a href="/" className="bgs">Get Started</a></li>
                            </ul>
                        </nav>
                        <div className="others_options">
                            <a href="/"><i className="fa fa-expand-arrows-alt"> </i></a>
                            <a href="#" className="light_v"><i className="fa fa-lightbulb"> </i></a>
                            <p>
                                <i className="fa fa-globe-africa"></i>
                                <select className="basic">
                                    <option>English</option>
                                    <option>한국어</option>
                                    <option>繁體中文</option>
                                    <option>简体中文</option>
                                </select>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;