import React, {Component} from 'react';
import Callaction from './callAction';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];
function announcOnes(e)
{
    e.preventDefault();
    var views = e.target.id;
    $('.defltC').addClass('active');
    $('#'+views).removeClass('active');
    $('.defultClass').css('display','none');
    $('#detail1'+views).css('display','block');
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
    .then(data => {console.log(data.hits);this.setState({ hitss: data.hits }); });



}
render(){
    const { hitss } = this.state;
        return(
            <div className="aboutPage">
                <div className="announcementWrap">
                    <div className="container">
                        <div className="announcementInner clearfix">
                        <div className="announceLeft">
                                {hitss.map(hit =>
                                    <a style={{'background': this.state.colors}} href="/" className="defltC active" id={hit._id} onClick={announcOnes}>{hit._source.tickerTitle}</a>
                                )}
                            </div>
                            <div className="announceRight">
                                {hitss.map(hit =>
                                    <div className="annouceDetail defultClass" id={'detail1'+hit._id}>
                                        <h3>{hit._source.tickerTitle}</h3>
                                        <p>{hit._source.tickerContent}</p>
                                        <p>{hit._source.dateTimes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Callaction />
            </div>
        )
    }
}

export default Home;