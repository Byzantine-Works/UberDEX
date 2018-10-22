import React, {Component} from 'react';
import Header from './header';
import EOS from './home_page/eos_table';
import Call_action from './call_action';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="market_page">
                <div className="wellcom_banner">
                    <Header />
                </div>
                <EOS />
                <Call_action />
                <Footer />
            </div>
        )
    }
}

export default Home;