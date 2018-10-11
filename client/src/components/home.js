import React, {Component} from 'react';
import Header from './header';
import Banner from './main_banner';
import EOS from './eos_table';
import Features from './features';
import Call_action from './call_action';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="Home_page">
                <div className="wellcom_banner">
                    <Header />
                    <Banner />
                </div>
                <EOS />
                <Features />
                <Call_action />
                <Footer />
            </div>
        )
    }
}

export default Home;