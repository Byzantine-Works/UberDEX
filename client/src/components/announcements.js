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