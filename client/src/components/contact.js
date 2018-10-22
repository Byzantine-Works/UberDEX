import React, {Component} from 'react';
import Header from './header';
import Call_action from './call_action';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="about_page">
                <div className="wellcom_banner">
                    <Header />
                </div>
                <div className="about_wrap">
                    <div className="container">
                        <h3>How to contact us?</h3>
                        <p>If you have any problem while using  uberDex and need help, or if you have any suggestion, please</p>
                        <p>send email to 'support@uberDex.com'. We will deal with it for you as soon as possible.</p>
                        <p>information to contact us.</p>
                        <p>Business cooperation email: bd@uberDex.io</p>
                        <p>Technical support email: tech@uberDex.io</p>
                    </div>
                </div>
                <Call_action />
                <Footer />
            </div>
        )
    }
}

export default Home;