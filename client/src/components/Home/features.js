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
}
render(){
    const { colors } = this.state;
        return(
            <div className="features" rel={this.state.colors}>
                <div className="container">
                    <div className="featuresTop clearfix">
                        <div className="left">
                            <h3 className="colors"   style={{'color': this.state.colors}}>Everything you need to buy and <br /> sell EOS today</h3>
                            <ul>
                                <li>
                                    <span className="drk"><img src={icon1} /></span>
                                    <span className="lit"><img src={iconh1} /></span>
                                    <span className="litb"><img src={iconb1} /></span>
                                    <span className="litg"><img src={icong1} /></span>
                                    <span className="litl"><img src={iconl1} /></span>
                                    <span className="litp"><img src={iconp1} /></span>
                                    <span className="litr"><img src={iconr1} /></span>
                                    <span className="lity"><img src={icony1} /></span>
                                    <h5 className="colors"  style={{'color': this.state.colors}}>Buy & sell major cryptocurrencies</h5>
                                    <p>You can buy bitcoin, ethereum, & more instantly with a bank account or debit card.</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon2} /></span>
                                    <span className="lit"><img src={iconh2} /></span>
                                    <span className="litb"><img src={iconb2} /></span>
                                    <span className="litg"><img src={icong2} /></span>
                                    <span className="litl"><img src={iconl2} /></span>
                                    <span className="litp"><img src={iconp2} /></span>
                                    <span className="litr"><img src={iconr2} /></span>
                                    <span className="lity"><img src={icony2} /></span>
                                    <h5 className="colors"  style={{'color': this.state.colors}}>Access prices & price charts</h5>
                                    <p>Wondering how your crypto is doing? Check prices on the web or with our Android or IOS app.</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon3} /></span>
                                    <span className="lit"><img src={iconh3} /></span>
                                    <span className="litb"><img src={iconb3} /></span>
                                    <span className="litg"><img src={icong3} /></span>
                                    <span className="litl"><img src={iconl3} /></span>
                                    <span className="litp"><img src={iconp3} /></span>
                                    <span className="litr"><img src={iconr3} /></span>
                                    <span className="lity"><img src={icony3} /></span>
                                    <h5 className="colors"  style={{'color': this.state.colors}}>Store your crypto safely</h5>
                                    <p>Over 98% of cryptocurrency is stored offline & the rest is protected by industry-leading online security</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon4} /></span>
                                    <span className="lit"><img src={iconh4} /></span>
                                    <span className="litb"><img src={iconb4} /></span>
                                    <span className="litg"><img src={icong4} /></span>
                                    <span className="litl"><img src={iconl4} /></span>
                                    <span className="litp"><img src={iconp4} /></span>
                                    <span className="litr"><img src={iconr4} /></span>
                                    <span className="lity"><img src={icony4} /></span>
                                    <h5 className="colors"  style={{'color': this.state.colors}}>Set automatic buys</h5>
                                    <p>If you'd to buy a little crypto week or every month, we make it simple</p>
                                </li>
                            </ul>
                        </div>
                        <div className="right">
                            <img src={mobile}  />
                        </div>
                    </div>

                    <div className="featureBottom">
                        <ul className="clearfix">
                            <li>
                                <img className="drk" src={icon5}  />
                                <img className="lit" src={iconh5}  />
                                <img className="litb" src={iconb5}  />
                                <img className="litg" src={icong5}  />
                                <img className="litl" src={iconl5}  />
                                <img className="litp" src={iconp5}  />
                                <img className="litr" src={iconr5}  />
                                <img className="lity" src={icony5}  />
                                <h4 className="colors"  style={{'color': this.state.colors}}>Friendly user Experience</h4>
                                <p>{this.state.companyName} aims to be the best performing and easiest-to-use decentralized Exchange.</p>
                            </li>
                            <li>
                                <img className="drk" src={icon6}  />
                                <img className="lit" src={iconh6}  />
                                <img className="litb" src={iconb6}  />
                                <img className="litg" src={icong6}  />
                                <img className="litl" src={iconl6}  />
                                <img className="litp" src={iconp6}  />
                                <img className="litr" src={iconr6}  />
                                <img className="lity" src={icony6}  />
                                <h4 className="colors"  style={{'color': this.state.colors}}>No need to trust, high security</h4>
                                <p>We relay orders between peers. {this.state.companyName} moves tokens between wallets. Together, we’re a new category where the platform itself is distributed.</p>
                            </li>
                            <li>
                                <img className="drk" src={icon7}  />
                                <img className="lit" src={iconh7}  />
                                <img className="litb" src={iconb7}  />
                                <img className="litg" src={icong7}  />
                                <img className="litl" src={iconl7}  />
                                <img className="litp" src={iconp7}  />
                                <img className="litr" src={iconr7}  />
                                <img className="lity" src={icony7}  />
                                <h4 className="colors"  style={{'color': this.state.colors}}>Open, high transparency</h4>
                                <p>Leverage blockchain technology to trade EOS tokens directly from your wallet. No middleman.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Features;