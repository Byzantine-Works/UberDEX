import React, {Component} from 'react';
import Header from './header';
import Trading from './exchange_page/trading';
import TradingCenter from './exchange_page/trading_center';
import Order from './exchange_page/order';
import Call_action from './call_action';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="market_page">
                <div className="wellcom_banner">
                    <Header />
                </div>
                <Trading />
                <TradingCenter />
                <Order />
                <Call_action />
                <Footer />
            </div>
        )
    }
}

export default Home;