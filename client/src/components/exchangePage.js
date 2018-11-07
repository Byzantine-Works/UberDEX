import React, {Component} from 'react';
import Header from './header';
import Trading from './Exchange/trading';
import TradingCenter from './Exchange/tradingPlatform';
import Order from './Exchange/order';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    constructor(props) {
        super(props)

    }
    render(){
     
        return(
            <div className="marketPage">
                <div className="wellcomBanner background" style={color}>
                    <Header />
                </div>
                <Trading />
                <TradingCenter scatterID={this.props.scatterID} updateScatterID={this.props.updateScatterID}/>
                <Order updateScatterID={this.props.updateScatterID}/>
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
            </div>
        )
    }
}

export default Home;