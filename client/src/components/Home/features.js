import React, {Component} from 'react';
import mobile from '../imgs/mobile.png';
import icon1 from '../imgs/icon1.png';
import icon2 from '../imgs/icon2.png';
import icon3 from '../imgs/icon3.png';
import icon4 from '../imgs/icon4.png';
import icon5 from '../imgs/icon5.png';
import icon6 from '../imgs/icon6.png';
import icon7 from '../imgs/icon7.png';

import iconh1 from '../imgs/iconh1.png';
import iconh2 from '../imgs/iconh2.png';
import iconh3 from '../imgs/iconh3.png';
import iconh4 from '../imgs/iconh4.png';
import iconh5 from '../imgs/iconh5.png';
import iconh6 from '../imgs/iconh6.png';
import iconh7 from '../imgs/iconh7.png';

import iconb1 from '../imgs/iconb1.png';
import iconb2 from '../imgs/iconb2.png';
import iconb3 from '../imgs/iconb3.png';
import iconb4 from '../imgs/iconb4.png';
import iconb5 from '../imgs/iconb5.png';
import iconb6 from '../imgs/iconb6.png';
import iconb7 from '../imgs/iconb7.png';

import icong1 from '../imgs/icong1.png';
import icong2 from '../imgs/icong2.png';
import icong3 from '../imgs/icong3.png';
import icong4 from '../imgs/icong4.png';
import icong5 from '../imgs/icong5.png';
import icong6 from '../imgs/icong6.png';
import icong7 from '../imgs/icong7.png';

import iconl1 from '../imgs/iconl1.png';
import iconl2 from '../imgs/iconl2.png';
import iconl3 from '../imgs/iconl3.png';
import iconl4 from '../imgs/iconl4.png';
import iconl5 from '../imgs/iconl5.png';
import iconl6 from '../imgs/iconl6.png';
import iconl7 from '../imgs/iconl7.png';

import iconp1 from '../imgs/iconp1.png';
import iconp2 from '../imgs/iconp2.png';
import iconp3 from '../imgs/iconp3.png';
import iconp4 from '../imgs/iconp4.png';
import iconp5 from '../imgs/iconp5.png';
import iconp6 from '../imgs/iconp6.png';
import iconp7 from '../imgs/iconp7.png';

import iconr1 from '../imgs/iconr1.png';
import iconr2 from '../imgs/iconr2.png';
import iconr3 from '../imgs/iconr3.png';
import iconr4 from '../imgs/iconr4.png';
import iconr5 from '../imgs/iconr5.png';
import iconr6 from '../imgs/iconr6.png';
import iconr7 from '../imgs/iconr7.png';

import icony1 from '../imgs/icony1.png';
import icony2 from '../imgs/icony2.png';
import icony3 from '../imgs/icony3.png';
import icony4 from '../imgs/icony4.png';
import icony5 from '../imgs/icony5.png';
import icony6 from '../imgs/icony6.png';
import icony7 from '../imgs/icony7.png';

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
    .then(data => {if(data.theme_color=='')
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
    const { colors } = this.state;
    const { hitss } = this.state;
    const { hitsss } = this.state;
        return(
            <div className="features" rel={this.state.colors}>
                <div className="container">
                    <div className="featuresTop clearfix">
                        <div className="left">
                            <h3 className="colors"   style={{'color': this.state.colors}}>Everything you need to buy and <br /> sell EOS today</h3>
                            <ul>
                                {hitss.sort((a, b) => a.featureId + b.featureId).map(hit =>
                                    <li>
                                        <span className="drk"><img src={'https://uberdex-admin.herokuapp.com/images/features/'+hit._source.featureDark} /></span>
                                        <span className="lit"><img src={'https://uberdex-admin.herokuapp.com/images/features/'+hit._source.featureLight} /></span>
                                        <h5 className="colors"  style={{'color': this.state.colors}}>{hit._source.featureTitle}</h5>
                                        <p>{hit._source.featureDesc}</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="right">
                            <img src={mobile}  />
                        </div>
                    </div>

                    <div className="featureBottom">
                        <ul className="clearfix">
                        {hitsss.map(hit =>
                                <li>
                                    <img className="drk" src={'https://uberdex-admin.herokuapp.com/images/services/'+hit._source.serviceDark}  />
                                    <img className="lit" src={'https://uberdex-admin.herokuapp.com/images/services/'+hit._source.serviceLight}  />
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