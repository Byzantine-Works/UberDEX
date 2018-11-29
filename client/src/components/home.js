import React, {Component} from 'react';
import Header from './header';
import Banner from './Home/mainBanner';
import EOS from './Home/eosTable';
import Features from './Home/features';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};
var logoUrl = data['logo'];
console.log(logoUrl);


class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            colors: [],
            logo: [],
        };
    }

    // componentDidMount() {
   
    //     fetch('https://uberdex-admin.herokuapp.com/getColors')
    //     .then(response => response.json())
    //     .then(data => {this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo}); });
    // }

    render(){
        const { colors } = this.state;
            return(
                <div className="HomePage" >
                    <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                        <Banner />
                    </div>
                        <EOS />
                        <Features />
                        <Callaction />
                    </div>
        )
    }
}

export default Home;