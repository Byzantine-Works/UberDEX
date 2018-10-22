import React, {Component} from 'react';
import Header from './header';
import Call_action from './call_action';
import Footer from './footer';

class Home extends Component{
    render(){
       
        return(
            <div className="support_page">
                <div className="wellcom_banner">
                    <Header />
                </div>
                
                <div className="recnt_activity">
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
                <Call_action />
                <Footer />
            </div>
        )
    }
}

export default Home;