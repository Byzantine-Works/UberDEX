import React, {Component} from 'react';
import { TVChartContainer } from './TVChartContainer/index';

import Callaction from './callAction';
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Support extends Component{
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
    .then(data => {if(data.theme_color==='')
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
        return(
            <div className="supportPage">
                    <TVChartContainer />
                    <Callaction />
    
            </div>
        )
    }
}

export default Support;