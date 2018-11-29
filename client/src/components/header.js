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
     var scatter =ScatterJS.scatter;
     if(scatter.identity){   alert(scatter.identity.publicKey);}
//console.log(scatter.identity.publicKey);
}

function handleClick(e) {
    e.preventDefault();
    $('.signInPopup ').fadeIn();
  }
  
function handleSignout(e){
    e.preventDefault();
     ScatterJS.scatter.forgetIdentity();
 window.location.reload();
}
  


const tryRequire = (path) => {
    try {
     return require(`${path}`);
    } catch (err) {
     return null;
    }
  };

class Header extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
    //handledefualt();
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
                                <li id="signin"><a href="/"  onClick={handleClick}>Sign In</a></li>
                                <li id="signout"><a href="/"  onClick={handleSignout}>Sign out</a></li>
                                <li><a href="/" className="bgs"  onClick={handlePublic}>Get Started</a></li>
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