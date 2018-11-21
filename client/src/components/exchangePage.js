import React, {Component} from 'react';
import TradingCenter from './Exchange/tradingPlatform';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    render(){
       
        return(
            <div className="marketPage">
                <TradingCenter />
                <Footer />
            </div>
        )
    }
}

export default Home;