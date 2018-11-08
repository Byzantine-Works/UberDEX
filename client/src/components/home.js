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
    render(){
       
        return(
            <div className="HomePage" >
                <div className="wellcomBanner background" style={color}>
                    <Header />
                    <Banner />
                </div>
                <EOS />
                <Features />
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;