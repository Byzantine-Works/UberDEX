import React, {Component} from 'react';
import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import data from '../app.json';
var color = {background: data['theme_color']};

class Home extends Component{
    render(){
       
        return(
            <div className="aboutPage">
                <div className="wellcomBanner background" style={color}>
                    <Header />
                </div>
                <div className="aboutWrap">
                    <div className="container">
                        <h3>Trading rules</h3>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                </div>
                <Callaction />
                <Footer />
            </div>
        )
    }
}

export default Home;