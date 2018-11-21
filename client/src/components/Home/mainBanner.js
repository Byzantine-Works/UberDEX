import React, {Component} from 'react';
import data from '../../app.json';
var color = {background: data['theme_color']};

class Home_banner extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
    };
  }

componentDidMount() {
   
    fetch('https://uberdex-admin.herokuapp.com/getColors')
    .then(response => response.json())
    .then(data => {this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo}); });
}
render(){
    const { colors } = this.state;
        return(
            <div className="mainBanner">
                <div className="container">
                    <h1>The First EOS based decentralized exchange in the world</h1>
                    <p>No deposit / No withdrawal / Safe assets/ Open and transparency</p>
                    <form>
                        <div className="pmsField">
                            <input type="text" placeholder="" />
                            <label  style={{'background': this.state.colors}}>Email Address</label>
                        </div>
                        <input type="submit" value="Sign Up" />
                        <a href="#">Join our Telegram</a>
                    </form>
                </div>
            </div>
        )
    }
}

export default Home_banner;