import React, {Component} from 'react';
import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import $ from "jquery";
import data from '../app.json';
var color = {background: data['theme_color']};

class Contact extends Component{
    constructor(props) {
        super(props);
    }
     postSignup = (e) => {
    e.preventDefault();
     let data = {
        firstName : this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        msg: this.msg.value,
         
    };
    fetch('http://localhost:5000/sendEmail/', {
    method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
  body: JSON.stringify(data)

  }).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        
        if(res.data.error=='1')
        {
        
        return false;
        }
        else if(res.data.error=='0')
        {
            $('.msgs').show();
        }
    
    }));
  }
    render(){
       
        return(
            <div className="about_page">
                <div className="wellcomBanner background" style={color}>
                <Header updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
                </div>
                <div className="about_wrap contactPage">
                    <div className="container clearfix">
                        <div className="leftDetails">
                            <h3>How to contact us?</h3>
                            <p>If you have any problem while using  uberDex and need help, or if you have any suggestion, please</p>
                            <p>send email to 'support@uberDex.com'. We will deal with it for you as soon as possible.</p>
                            <p>information to contact us.</p>
                            <p>Business cooperation email: bd@uberDex.io</p>
                            <p>Technical support email: tech@uberDex.io</p>
                        </div>
                        <div className="rightName">
                            <form name="contact" method="post" >
                                <div>
                                    <input type="text" name="firstName" ref={(r) => this.firstName = r} id="firstName" placeholder="First Name" />
                                    <input type="text" name="lastName" ref={(r) => this.lastName = r} id="lastName" placeholder="Last Name" />
                                </div>
                                <div>
                                    <input type="email" name="email" id="email" ref={(r) => this.email = r} placeholder="Email" />
                                    <input type="text" name="phone" id="phone" ref={(r) => this.phone = r} placeholder="Phone" />
                                </div>
                                <textarea placeholder="Message" name="message" ref={(r) => this.msg = r} id='msg_text'></textarea>
                                <input type="submit" className="fr1 background" style={color} name="send"  onClick={this.postSignup} value="Send Message"  />
                            </form>
                            <div className="msgs" style={{'display': 'none'}}>Your Message Successfuly Send</div>
                        </div>
                    </div>
                </div>
                <Callaction />
                <Footer updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>
            </div>
        )
    }
}

export default Contact;