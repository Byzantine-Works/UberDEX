import React, {Component} from 'react';
import { TVChartContainer } from './TVChartContainer/index';

import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    render(){
       
        return(
            <div className="supportPage">
                <div className="wellcomBanner background" style={color}>
                    <Header />
                </div>
                <TVChartContainer />
                
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
            </div>
        )
    }
}

export default Home;