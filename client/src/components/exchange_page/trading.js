import React, {Component} from 'react';
import $ from "jquery";

function handleClick(e) {
    e.preventDefault();
    $('.ist').hide();
    $('.open_detail ').slideDown();
    $('.ind').show();
  }
  
function handleClicks(e) {
    e.preventDefault();
    $('.ind').hide();
    $('.open_detail ').slideUp();
    $('.ist').show();
  }
class Home_banner extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          hits: [],
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var API = 'http://api.byzanti.ne:8902/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ hits: data }); });
    }


    render(){
       
        const { hits } = this.state;
        return(
            <div className="trading_head">
                <div className="container">
                
                {hits.map(hit =>
                    <div className="trading clearfix">
                        <div className="lefts">
                            <span>{hit.symbol}</span>
                            <h4>{hit.symbol} / <small> EOS</small></h4>
                            <p className="ist" onClick={handleClick}>Introduction</p>
                            <p className="ind" onClick={handleClicks}>Introduction</p>
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
                        <div className="open_detail clearfix">
                            <div className="intro">
                                <h3>Introduction</h3>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                            </div>
                            <div className="contrct">
                                <p><strong>Total Supply</strong>
                                10,000,000,000</p>
                                <p><strong>Circulating</strong>
                                5,200,000,000</p>
                                <p><strong>Contract</strong>
                                {hit.contract}</p>
                                <p><strong>Website</strong>
                                https://uberdex.com</p>
                            </div>
                        </div>
                    </div>
                
                )}
                </div>
            </div>
        )
    }
}

export default Home_banner;