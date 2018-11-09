import React, {Component} from 'react';
import { TVChartContainer } from './TVChartContainer/index';

import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Support extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        console.log("this.props: ", this.props)
       
        return(
            <div className="supportPage">
                <div className="wellcomBanner background" style={color}>
                <Header updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
                </div>
                <TVChartContainer />
                
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
            </div>
        )
    }
}

export default Support;