import React, {Component} from 'react';
import TradingCenter from './Exchange/tradingPlatform';
import Callaction from './callAction';


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
                <TradingCenter updateOpenOrders={this.updateOpenOrders} scatterID={this.props.scatterID} updateScatterID={this.props.updateScatterID} balance={this.props.balance}/>
                <Callaction />
            </div>
        )
    }
}

export default Home;