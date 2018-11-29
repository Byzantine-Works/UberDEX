import React, {Component} from 'react';
import Header from './header';
import Banner from './Home/mainBanner';
import EOS from './Home/eosTable';
import Features from './Home/features';
import Callaction from './callAction';
import Footer from './footer';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

function handledefualt(e)
{
   if($('body').hasClass('lightVersion'))
    {
      $('.darkt').css('display', 'inline-block');
$('.lightT').css('display', 'none');
    }
    else
    {
      $('.darkt').css('display', 'none');
$('.lightT').css('display', 'inline-block');
    }
}

class Home extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
   
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color=='')
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
    
    setTimeout(function(){
        handledefualt();
           
    },3000);
}
render(){
    const { colors } = this.state;
        return(
            <div className="HomePage" >
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Header />
                    <Banner />
                </div>
                <EOS />
                <Features />
                <div className="newsScroll">
                    <div className="container">
                        <marquee>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Lists EOSYX/EOS, INF/EOS Exchange Pairs Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Joints with PTI to Hold the First PTI Airdrop</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Lists FAST/EOS, SHARE/EOS, ECTT/EOS Exchange Fairs Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Lists ARN/EOS New Exchange Pair Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Lists YDAPP/EOS, CRASH/EOS Exchange Pairs Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Delists PUB/EOS Exchange Pair Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Resumed DBET/EOS Transaction Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Suspends DBET/EOS Trade Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Lists GYM/EOS Exchange Pair Announcement</a>
                            <a style={{'color': this.state.colors}} href="/announcements">{this.state.companyName} Finishes the First Airdrop of TKC and Lists TKC at 03:00 (UTC) on 22 November</a>
                        </marquee>
                    </div>
                </div>
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;