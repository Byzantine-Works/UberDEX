import React, {Component} from 'react';
import $ from "jquery";
import dp from '../../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

class Home_banner extends Component{
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
        this.setState({colors:data.theme_color}); 
        this.setState({logo:adminURL+'/images/byzantine/'+data.logo});
    }
    }).catch(data => {
        this.setState({colors:'#0e9caf'});
    });
    
    fetch(adminURL+'/getContents/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.mainTitle==='')
    {
        
        $('#mainTitle').html('The First EOS based decentralized exchange in the world');
        $('#mainDesc').html('No deposit / No withdrawal / Safe assets/ Open and transparency');
    }
    else
    {
        $('#mainTitle').html(data.mainTitle);
        $('#mainDesc').html(data.mainContent);

    }
    }).catch(data => {
        $('#mainTitle').html('The First EOS based decentralized exchange in the world');
        $('#mainDesc').html('No deposit / No withdrawal / Safe assets/ Open and transparency');
    });

}
render(){
        return(
            <div className="mainBanner">
                <div className="container">
                    <h1 id="mainTitle">The First EOS based decentralized exchange in the world</h1>
                    <p id="mainDesc">No deposit / No withdrawal / Safe assets/ Open and transparency</p>
                    <form>
                        <div className="pmsField">
                            <input type="text" placeholder="" />
                            <label  style={{'background': this.state.colors}}>Email Address</label>
                        </div>
                        <input type="submit" value="Sign Up" />
                        <a href="/">Join our Telegram</a>
                    </form>
                </div>
            </div>
        )
    }
}

export default Home_banner;