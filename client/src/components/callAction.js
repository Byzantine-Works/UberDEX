import React, {Component} from 'react';
import data from '../app.json';
var color = {background: data['theme_color']};

class Call_action extends Component{
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
            <div className="callAction">
                <div className="callInner background"  style={{'background': this.state.colors}}>
                    <div className="container">
                        <form>
                            <input type="text" placeholder="Email Address" />
                            <input type="submit" value="Get Started" />
                        </form>
                        <h5>Ready to buy EOS?</h5>
                        <h5>Get started with $50 or less</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default Call_action;