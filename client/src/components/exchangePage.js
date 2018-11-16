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
        super(props);
        this.state = {
            openOrders : false,
        }

        this.updateOpenOrders = this.updateOpenOrders.bind(this);

    }

    updateOpenOrders(newOrders){
        this.setState({openOrders: newOrders})

    }
    render(){
     
        return(
            <div className="marketPage">
                <div className="wellcomBanner background" style={color}>
                    <Header updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
                </div>
                <Trading />
                <TradingCenter updateOpenOrders={this.updateOpenOrders} scatterID={this.props.scatterID} updateScatterID={this.props.updateScatterID}/>
                <Order scatterID={this.props.scatterID} updateScatterID={this.props.updateScatterID} openOrders={this.state.openOrders}/>
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
            </div>
        )
    }
}

export default Home;