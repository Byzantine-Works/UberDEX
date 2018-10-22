import React, {Component} from 'react';
import Header from './header';
import Banner from './home_page/main_banner';
import EOS from './home_page/eos_table';
import Features from './home_page/features';
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