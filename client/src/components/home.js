import React, {Component} from 'react';
import Header from './header';
import Banner from './Home/mainBanner';
import EOS from './Home/eosTable';
import Features from './Home/features';
import Callaction from './callAction';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="HomePage">
                <div className="wellcomBanner">
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