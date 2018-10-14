import React, {Component} from 'react';
import logo from './logo_main.png';
import logos from './logos.png';

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
                                <li><a href="/">Exchange</a></li>
                                <li><a href="/">Markets</a></li>
                                <li><a href="/">Supports</a></li>
                                <li><a href="/">Sign In</a></li>
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
                                    <option>Urdu</option>
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