import React, {Component} from 'react';
import mobile from '../imgs/mobile.png';

import dp from '../../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Features extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
        hitss: [],
        hitsss: [],
    };
  }

componentDidMount() {
   
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color==='')
    {
        this.setState({companyName:'UberDex'});
        this.setState({colors:'#0e9caf'});
    }
    else
    {
        this.setState({companyName:data.companyName});
        this.setState({colors:data.theme_color}); 
        this.setState({logo:adminURL+'/images/byzantine/'+data.logo});
    }
    }).catch(data => {
        this.setState({companyName:'UberDex'});
        this.setState({colors:'#0e9caf'});
    });
    
    var API = adminURL+'/getfeatures/'+apiId;
    fetch(API)
    .then(response => response.json())
    .then(data => {this.setState({ hitss: data.hits }); });

    var APIs = adminURL+'/getservices/'+apiId;
    fetch(APIs)
    .then(response => response.json())
    .then(data => {this.setState({ hitsss: data.hits }); });

}
render(){
    const { hitss } = this.state;
    const { hitsss } = this.state;
    
        return(
            <div className="features" rel={this.state.colors}>
                <div className="container">
                    <div className="featuresTop clearfix">
                        <div className="left">
                            <h3 className="colors"   style={{'color': this.state.colors}}>Everything you need to buy and <br /> sell EOS today</h3>
                            <ul>
                                {hitss.sort((a, b) => a.featureId + b.featureId).map((hit, i) =>
                                    <li  key={i}>
                                        <span className="drk"><img src={'https://uberdex-admin.herokuapp.com/images/features/'+hit._source.featureDark}  alt="" /></span>
                                        <span className="lit"><img src={'https://uberdex-admin.herokuapp.com/images/features/'+hit._source.featureLight}  alt="" /></span>
                                        <h5 className="colors"  style={{'color': this.state.colors}}>{hit._source.featureTitle}</h5>
                                        <p>{hit._source.featureDesc}</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="right">
                            <img src={mobile}  alt=""  />
                        </div>
                    </div>

                    <div className="featureBottom">
                        <ul className="clearfix">
                        {hitsss.map((hit, i) =>
                                <li  key={i}>
                                    <img className="drk" src={'https://uberdex-admin.herokuapp.com/images/services/'+hit._source.serviceDark} alt="" />
                                    <img className="lit" src={'https://uberdex-admin.herokuapp.com/images/services/'+hit._source.serviceLight} alt=""   />
                                    <h4 className="colors"  style={{'color': this.state.colors}}>{hit._source.serviceTitle}</h4>
                                    <p>{hit._source.serviceContent}</p>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Features;