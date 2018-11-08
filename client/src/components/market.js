import React, {Component} from 'react';
import Header from './header';
import EOS from './Home/eosMarket';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    render(){
       
        return(
            <div className="marketPage">
                <div className="wellcomBanner background" style={color}>
                    <Header />
                </div>
                <EOS />
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;