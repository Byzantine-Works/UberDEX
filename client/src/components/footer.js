import React, {Component} from 'react';
import logo_blue from './imgs/logo_blue.png';

class Footer extends Component{
    render(){
       
        return(
            <div className="footer">
                <div className="container clearfix">
                    <div className="widget">
                        <img src={logo_blue} />
                        <p>Cryptocurrency investment is subject to high market risk, please make your investments cautiously.</p>
                        <span>Copyright 2018 UberDex Inc. All Right Reserved.</span>
                    </div>
                    
                    <div className="widget">
                        <h5>Products</h5>
                        <ul>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                        </ul>
                    </div>
                    
                    <div className="widget">
                        <h5>Learn</h5>
                        <ul>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                            <li><a href="/">Lorem Ipsum</a></li>
                        </ul>
                    </div>
                    
                    <div className="widget">
                        <h5>Company</h5>
                        <ul>
                            <li><a href="/">About </a></li>
                            <li><a href="/">Careers</a></li>
                            <li><a href="/">Press</a></li>
                            <li><a href="/">Open Source</a></li>
                            <li><a href="/">Legal & Privacy</a></li>
                            <li><a href="/">Support</a></li>
                        </ul>
                    </div>

                    <div className="widget">
                        <h5>Social</h5>
                        <ul>
                            <li><a href="/">Blog </a></li>
                            <li><a href="/">Twitter</a></li>
                            <li><a href="/">Facebook</a></li>
                        </ul>
                    </div>


                </div>
            </div>
        )
    }
}

export default Footer;