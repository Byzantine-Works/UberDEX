import React, {Component} from 'react';
import $ from "jquery";
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
        agreement: [],
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
    
    fetch(adminURL+'/getContents/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.agreement=='')
    {
        $('#aboutContent').html('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum');
    }
    else
    {
        $('#titles').html(data.agreementTitle);
        $('#aboutContent').html(data.agreement);
    }
    }).catch(data => {
        $('#aboutContent').html('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum');
    });

}
render(){
    const { colors } = this.state;
        return(
            <div className="aboutPage">
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Header />
                </div>
                <div className="aboutWrap">
                    <div className="container">
                        <h3 id="titles">User Agreement</h3>
                        <p id="aboutContent"></p>
                    </div>
                </div>
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;