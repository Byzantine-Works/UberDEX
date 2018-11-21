import React, {Component} from 'react';
import $ from "jquery";
import data from '../../app.json';
var color = {background: data['theme_color']};
var colors = {color: data['theme_color']};

function handleClick(e) {
    e.preventDefault();
    $('.ist').hide();
    $('.openDetail ').slideDown();
    $('.ind').show();
  }
  
  function openIntro()
  {
      $('.introAlart').fadeIn();
  }


function handleClicks(e) {
    e.preventDefault();
    $('.ind').hide();
    $('.openDetail ').slideUp();
    $('.ist').show();
  }
class tradingHead extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          hits: [],
          colors: [],
          logo: [],
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ hits: data }); });

        fetch('https://uberdex-admin.herokuapp.com/getColors')
        .then(response => response.json())
        .then(data => {this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo}); });
    }


    render(){
       
        const { hits } = this.state;
        return(
            <div className="tradingHead">
            

                {hits.map(hit =>
                    <div className="tradingBlnces">
                        <h3 className=" background" style={{'background': this.state.colors}}>{hit.symbol}  / <small> EOS</small></h3>
                        <ul>
                            <li>
                                <p>Last Price</p>
                                <span className={hit.change < 0?'minus':'plus'}>{hit.last}</span> EOS
                            </li>
                            <li>
                                <p>24H Change</p>
                                <span className={hit.change < 0?'minus':'plus'}>{hit.change}</span>
                            </li>
                            <li>
                                <p>24H High</p>
                                <span>{hit.high} EOS </span> 
                            </li>
                            <li>
                                <p>24H Low</p>
                                <span>{hit.low} EOS</span> 
                            </li>
                            
                            <li>
                                <p>24H Volume </p>
                                <span>{hit.volume} {hit.symbol} </span> 
                            </li>
                            
                            <li>
                                <p>Contract </p>
                                <span>{hit.contract} </span>
                            </li>
                        </ul>
                    </div>
                
                )}
            </div>
        )
    }
}

export default tradingHead;