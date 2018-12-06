import React, {Component} from 'react';
import $ from "jquery";
import Callaction from './callAction';
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Home extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
        trade:[],
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

    fetch(adminURL+'/getContents/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.trade==='')
    {
        $('#aboutContent').html('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum');
    }
    else
    {
        $('#titles').html(data.tradeTitle);
        $('#aboutContent').html(data.trade);
    }
    }).catch(data => {
        $('#aboutContent').html('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum');
    });
}
render(){
        return(
            <div className="aboutPage">
                <div className="aboutWrap">
                    <div className="container">
                        <h3 id="titles">How to trade?</h3>
                        <p id="aboutContent"></p>
                    </div>
                </div>
                <Callaction />
            </div>
        )
    }
}

export default Home;