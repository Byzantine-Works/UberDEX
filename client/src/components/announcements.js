import React, {Component} from 'react';
import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
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
    .then(data => {if(data.theme_color=='')
    {
        this.setState({colors:'#0e9caf'});
    }
    else
    {
        this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo});
    }
    }).catch(data => {
        this.setState({colors:'#0e9caf'});
    });
}
render(){
    const { colors } = this.state;
        return(
            <div className="aboutPage">
                <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                    <Header />
                </div>
                
                <div className="recntActivity">
                    <div className="container">
                        <h3>Announcements</h3>
                        <ul>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                            <li>
                                <a href="/"> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;