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
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ hits: data }); });
    }


    render(){
       
        const { hits } = this.state;
        return(
            <div className="tradingHead">
                <div className="container">
                
                {hits.map(hit =>
                    <div className="trading clearfix">
                        <div className="lefts">
                            <span className=" background" style={color} >{hit.symbol}</span>
                            <h4>{hit.symbol} / <small> EOS</small></h4>
                            <p className="ist colors" style={colors} onClick={handleClick}>Introduction</p>
                            <p className="ind colors" style={colors} onClick={handleClicks}>Introduction</p>
                        </div>
                        <div className="rights">
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
                                    <span>{hit.high} </span> EOS
                                </li>
                                <li>
                                    <p>24H Low</p>
                                    <span>{hit.low} </span> EOS
                                </li>
                                
                                <li>
                                    <p>24H Volume </p>
                                    <span>{hit.volume} </span> {hit.symbol}
                                </li>
                            </ul>
                        </div>
                        <div className="openDetail clearfix">
                            <div className="contrct">
                                <p><strong>Total Supply</strong>
                                10,000,000,000</p>
                                <p><strong>Circulating</strong>
                                5,200,000,000</p>
                                <p><strong>Contract</strong>
                                {hit.contract}</p>
                                <p><strong>Website</strong>
                                https://{hit.symbol}.com</p>
                            </div>
                        </div>
                    </div>
                
                )}
                </div>
            </div>
        )
    }
}

export default tradingHead;