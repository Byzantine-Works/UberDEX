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
            <div className="supportPage">
                    <TVChartContainer />
                    <Callaction />
    
            </div>
        )
    }
}

export default Support;