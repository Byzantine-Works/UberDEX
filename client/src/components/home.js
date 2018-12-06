import React, {Component} from 'react';
import Banner from './Home/mainBanner';
import EOS from './Home/eosTable';
import Features from './Home/features';
import Callaction from './callAction';
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
            hitss: [],
        };
    }

    componentDidMount() {
   
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color==='')
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
    
    var API = adminURL+'/getNews/'+apiId;
    fetch(API)
    .then(response => response.json())
    .then(data => {this.setState({ hitss: data.hits }); });

     
    
    setTimeout(function(){
        handledefualt();
           
    },3000);
}
render(){
    const { hitss } = this.state;
        return(
            <div className="HomePage" >
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Banner />
                </div>
                <EOS />
                <Features />
                <div className="newsScroll">
                    <div className="container">
                        <marquee>
                            {hitss.map((hit, i) =>
                                <a key={i} style={{'color': this.state.colors}} href="/announcements">{hit._source.tickerTitle}</a>
                            )} 
                        </marquee>
                    </div>
                </div>
                <Callaction />
            </div>
        )
    }
}

export default Home;