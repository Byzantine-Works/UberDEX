import React, {Component} from 'react';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Call_action extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
   

    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color==='')
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
    
    fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.footerTitle==='')
    {
        $('#titless').html('Ready to buy EOS');
        $('#fContent').html('Get started with $50 or less');
    }
    else
    {
        $('#titless').html(data.footerTitle);
        $('#fContent').html(data.footerContent);

    }
    }).catch(data => {
        $('#titless').html('Ready to buy EOS');
        $('#fContent').html('Get started with $50 or less');
    });
}
render(){
    //const { colors } = this.state;
        return(
            <div className="callAction">
                <div className="callInner background"  style={{'background': this.state.colors}}>
                    <div className="container">
                        <form>
                            <input type="text" placeholder="Email Address" />
                            <input type="submit" value="Get Started" />
                        </form>
                        <h5 id="titless">Ready to buy EOS?</h5>
                        <h5 id="fContent">Get started with $50 or less</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default Call_action;