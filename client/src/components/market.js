import React, { Component } from 'react';
import Header from './header';
import EOS from './Home/eosMarket';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = { background: data['theme_color'] };

class Market extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props)

        return (
            <div className="marketPage">
                <div className="wellcomBanner background" style={color}>
                    <Header updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID} />
                </div>
                <EOS />
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID} />
            </div>
        )
    }
}

export default Market;