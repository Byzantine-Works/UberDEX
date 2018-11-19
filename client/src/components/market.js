import React, { Component } from 'react';
import Header from './header';
import EOS from './Home/eosMarket';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = { background: data['theme_color'] };

class Market extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
   
    fetch('https://uberdex-admin.herokuapp.com/getColors')
    .then(response => response.json())
    .then(data => {this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo}); });
}
render(){
    const { colors } = this.state;
        return(
            <div className="marketPage">
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
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