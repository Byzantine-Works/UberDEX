import React, {Component} from 'react';
import mobile from '../imgs/mobile.png';
import icon1 from '../imgs/iconh1.png';
import icon2 from '../imgs/iconh2.png';
import icon3 from '../imgs/iconh3.png';
import icon4 from '../imgs/iconh4.png';
import icon5 from '../imgs/iconh5.png';
import icon6 from '../imgs/iconh6.png';
import icon7 from '../imgs/iconh7.png';

import iconh1 from '../imgs/iconh1.png';
import iconh2 from '../imgs/iconh2.png';
import iconh3 from '../imgs/iconh3.png';
import iconh4 from '../imgs/iconh4.png';
import iconh5 from '../imgs/iconh5.png';
import iconh6 from '../imgs/iconh6.png';
import iconh7 from '../imgs/iconh7.png';

class Features extends Component{
    render(){
       
        return(
            <div className="features">
                <div className="container">
                    <div className="featuresTop clearfix">
                        <div className="left">
                            <h3>Everything you need to buy and <br /> sell EOS today</h3>
                            <ul>
                                <li>
                                    <span className="drk"><img src={icon1} /></span>
                                    <span className="lit"><img src={iconh1} /></span>
                                    <h5>Buy & sell major cryptocurrencies</h5>
                                    <p>You can buy bitcoin, ethereum, & more instantly with a bank account or debit card.</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon2} /></span>
                                    <span className="lit"><img src={iconh2} /></span>
                                    <h5>Access prices & price charts</h5>
                                    <p>Wondering how your crypto is doing? Check prices on the web or with our Android or IOS app.</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon3} /></span>
                                    <span className="lit"><img src={iconh3} /></span>
                                    <h5>Store your crypto safely</h5>
                                    <p>Over 98% of cryptocurrency is stored offline & the rest is protected by industry-leading online security</p>
                                </li>
                                <li>
                                    <span className="drk"><img src={icon4} /></span>
                                    <span className="lit"><img src={iconh4} /></span>
                                    <h5>Set automatic buys</h5>
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
                                <h4>Friendly user Experience</h4>
                                <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                            </li>
                            <li>
                                <img className="drk" src={icon6}  />
                                <img className="lit" src={iconh6}  />
                                <h4>No need to trust, high security</h4>
                                <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                            </li>
                            <li>
                                <img className="drk" src={icon7}  />
                                <img className="lit" src={iconh7}  />
                                <h4>Open, high transparency</h4>
                                <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Features;