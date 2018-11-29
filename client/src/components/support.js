import React, {Component} from 'react';
import { TVChartContainer } from './TVChartContainer/index';

import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Home extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
   
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color=='')
    {
        this.setState({colors:'#0e9caf'});
    }
    else
    {
        this.setState({colors:data.theme_color});
        this.setState({logo:adminURL+'/images/byzantine/'+data.logo});
    }
    }).catch(data => {
        this.setState({colors:'#0e9caf'});
    });
}
render(){
    const { colors } = this.state;
        return(
            <div className="supportPage">
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Header />
                </div>
                <TVChartContainer />
                
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;