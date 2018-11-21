import React, {Component} from 'react';
import Datafeed from './TVChartContainer/api/index';
import TradingCenter from './Exchange/tradingPlatform';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    render(){
       
        return(
            <div className="marketPage">
                <TradingCenter />
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;