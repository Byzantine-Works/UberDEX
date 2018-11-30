import React, {Component} from 'react';
import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

function announcOnes(e)
{
    e.preventDefault();
    $('#anounce1').removeClass('active');
    $('#anounce2').addClass('active');
    $('#anounce3').addClass('active');
    $('#anounce4').addClass('active');
    $('#anounce5').addClass('active');
    $('#detail1').css('display', 'block');
    $('#detail2').css('display', 'none');
    $('#detail3').css('display', 'none');
    $('#detail4').css('display', 'none');
    $('#detail5').css('display', 'none');
}
function tabannounctwo(e)
{
    e.preventDefault();
    $('#anounce1').addClass('active');
    $('#anounce2').removeClass('active');
    $('#anounce3').addClass('active');
    $('#anounce4').addClass('active');
    $('#anounce5').addClass('active');
    $('#detail1').css('display', 'none');
    $('#detail2').css('display', 'block');
    $('#detail3').css('display', 'none');
    $('#detail4').css('display', 'none');
    $('#detail5').css('display', 'none');
}
function announcthree(e)
{
    e.preventDefault();
    $('#anounce1').addClass('active');
    $('#anounce2').addClass('active');
    $('#anounce3').removeClass('active');
    $('#anounce4').addClass('active');
    $('.anounce5').addClass('active');
    $('#detail1').css('display', 'none');
    $('#detail2').css('display', 'none');
    $('#detail3').css('display', 'block');
    $('#detail4').css('display', 'none');
    $('#detail5').css('display', 'none');
}
function announcfour(e)
{
    e.preventDefault();
    $('#anounce1').addClass('active');
    $('#anounce2').addClass('active');
    $('#anounce3').addClass('active');
    $('#anounce4').removeClass('active');
    $('#anounce5').addClass('active');
    $('#detail1').css('display', 'none');
    $('#detail2').css('display', 'none');
    $('#detail3').css('display', 'none');
    $('#detail4').css('display', 'block');
    $('#detail5').css('display', 'none');
}
function announcfive(e)
{
    e.preventDefault();
    $('#anounce1').addClass('active');
    $('#anounce2').addClass('active');
    $('#anounce3').addClass('active');
    $('#anounce4').addClass('active');
    $('#anounce5').removeClass('active');
    $('#detail1').css('display', 'none');
    $('#detail2').css('display', 'none');
    $('#detail3').css('display', 'none');
    $('#detail4').css('display', 'none');
    $('#detail5').css('display', 'block');
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
}
render(){
    const { colors } = this.state;
        return(
            <div className="aboutPage">
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Header />
                </div>
                
                <div className="announcementWrap">
                    <div className="container">
                        <div className="announcementInner clearfix">
                            <div className="announceLeft">
                                <a style={{'background': this.state.colors}} href="#" className="" id="anounce1"  onClick={announcOnes}>{this.state.companyName} Lists EOSYX/EOS, INF/EOS Exchange Pairs Announcement</a>
                                <a style={{'background': this.state.colors}} href="#" className="active" id="anounce2" onClick={tabannounctwo}>{this.state.companyName} Joints with PTI to Hold the First PTI Airdrop</a>
                                <a style={{'background': this.state.colors}} href="#" className="active" id="anounce3" onClick={announcthree}>{this.state.companyName} Lists FAST/EOS, SHARE/EOS, ECTT/EOS Exchange Fairs Announcement</a>
                                <a style={{'background': this.state.colors}} href="#" className="active" id="anounce4" onClick={announcfour}>{this.state.companyName} Lists ARN/EOS New Exchange Pair Announcement</a>
                                <a style={{'background': this.state.colors}} href="#" className="active" id="anounce5" onClick={announcfive}>{this.state.companyName} Lists YDAPP/EOS, CRASH/EOS Exchange Pairs Announcement</a>
                            </div>
                            <div className="announceRight">
                                <div className="annouceDetail" id="detail1">
                                    <h3>{this.state.companyName} Lists EOSYX/EOS, INF/EOS Exchange Pairs Announcement</h3>
                                    <p>Dear users:</p>

                                   <p>{this.state.companyName} will list the following two new exchange pairs EOSYX/EOS and INF/EOS at 09:00 (UTC) on November 27, 2018.</p>

                                    <p>{this.state.companyName} Team</p>
                                    <p>November 27, 2018</p>
                                    <p>Twitter: https://twitter.com/{this.state.companyName}</p>
                                </div>
                                <div className="annouceDetail" id="detail2">
                                    <h3>{this.state.companyName} Joints with PTI to Hold the First PTI Airdrop</h3>
                                    <p>Dear users:</p>

                                   <p>{this.state.companyName} will list the following two new exchange pairs EOSYX/EOS and INF/EOS at 09:00 (UTC) on November 27, 2018.</p>

                                    <p>{this.state.companyName} Team</p>
                                    <p>November 27, 2018</p>
                                    <p>Twitter: https://twitter.com/{this.state.companyName}</p>

                                </div>
                                
                                <div className="annouceDetail" id="detail3">
                                    <h3>{this.state.companyName} Lists FAST/EOS, SHARE/EOS, ECTT/EOS Exchange Fairs Announcement</h3>
                                    <p>Dear users:</p>

                                   <p>{this.state.companyName} will list the following two new exchange pairs EOSYX/EOS and INF/EOS at 09:00 (UTC) on November 27, 2018.</p>

                                    <p>{this.state.companyName} Team</p>
                                    <p>November 27, 2018</p>
                                    <p>Twitter: https://twitter.com/{this.state.companyName}</p>
                                </div>
                                
                                <div className="annouceDetail" id="detail4">
                                    <h3>{this.state.companyName} Lists ARN/EOS New Exchange Pair Announcement</h3>
                                    <p>Dear users:</p>

                                   <p>{this.state.companyName} will list the following two new exchange pairs EOSYX/EOS and INF/EOS at 09:00 (UTC) on November 27, 2018.</p>

                                    <p>{this.state.companyName} Team</p>
                                    <p>November 27, 2018</p>
                                    <p>Twitter: https://twitter.com/{this.state.companyName}</p>
                                </div>
                                
                                <div className="annouceDetail" id="detail5">
                                    <h3>{this.state.companyName} Lists YDAPP/EOS, CRASH/EOS Exchange Pairs Announcement</h3>
                                    <p>Dear users:</p>

                                   <p>{this.state.companyName} will list the following two new exchange pairs EOSYX/EOS and INF/EOS at 09:00 (UTC) on November 27, 2018.</p>

                                    <p>{this.state.companyName} Team</p>
                                    <p>November 27, 2018</p>
                                    <p>Twitter: https://twitter.com/{this.state.companyName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;