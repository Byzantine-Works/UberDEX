import React, {Component} from 'react';
import Header from './header';
import Callaction from './callAction';
import Footer from './footer';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Contact extends Component{

     postSignup = (e) => {
    e.preventDefault();
     let data = {
        firstName : this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        msg: this.msg.value,
         
    };
    fetch('https://uberdex-admin.herokuapp.com/sendEmail/', {
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
  constructor(props) {
    super(props);


  this.state = {
      colors: [],
      logo: [],
      companyName: [],
      companyEmail: [],
      companyEmail: [],
      companyPhone: [],
      logo: [],
      companyDesc:[],
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
        this.setState({companyName:data.companyName}); 
        this.setState({companyEmail:data.companyEmail}); 
        this.setState({companyAddress:data.companyAddress}); 
        this.setState({companyPhone:data.companyPhone}); 
        this.setState({companyDesc:data.companyDesc});
    }
    }).catch(data => {
        this.setState({colors:'#0e9caf'});
    });
    
}
render(){
  const { colors } = this.state;
        return(
            <div className="about_page">
                <div className="about_wrap contactPage">
                    <div className="container clearfix">
                        <div className="leftDetails">
                            <h3>How to contact us?</h3>
                            <p>{this.state.companyDesc}</p>
                            <p>If you have any problem while using  {this.state.companyName} and need help, or if you have any suggestion, please</p>
                            <p>send email to '{this.state.companyEmail}'. We will deal with it for you as soon as possible.</p>
                            <p>information to contact us.</p>
                            <p>Business cooperation email: {this.state.companyEmail}</p>
                            <p>Technical support email: {this.state.companyEmail}</p>
                            <p>Technical support Phone: {this.state.companyPhone}</p>
                            <p>Address: {this.state.companyAddress}</p>
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
                                <input type="submit" className="fr1 background"  style={{'background': this.state.colors}} name="send"  onClick={this.postSignup} value="Send Message"  />
                            </form>
                            <div className="msgs" style={{'display': 'none'}}>Your Message Successfuly Send</div>
                        </div>
                    </div>
                </div>
                <Callaction />
            </div>
        )
    }
}

export default Contact;