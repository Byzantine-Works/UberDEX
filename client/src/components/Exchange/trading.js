import React, {Component} from 'react';
import $ from "jquery";
import dp from '../../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

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
          items: [],
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var contract = url.searchParams.get("contract");
        var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var CurrencyStats = 'https://api.byzanti.ne/getCurrencyStats?contract='+contract+'&symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ hits: data }); });

        fetch(CurrencyStats)
        .then(response => response.json())
        .then(data => {this.setState({ items: data[c] });});

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
    }


    render(){
       
        const { hits } = this.state;
      
        var url = new URL(window.location.href);
        var symbol = url.searchParams.get("opt");
        return(
            <div className="tradingHead">
                <div className="container">
                
                
                    <div className="trading clearfix">
                    {hits.map(hit =>
                        <div key={hit.symbol}>
                        <div className="lefts">
                            <span className=" background" style={{'background': this.state.colors}} ><img alt="img" src={"/coins/"+hit.symbol+".png"} /></span>
                            <h4>{hit.symbol} / <small> EOS</small></h4>
                            <p className="ist colors" style={{'color': this.state.colors}} onClick={handleClick}>Introduction</p>
                            <p className="ind colors" style={{'color': this.state.colors}} onClick={handleClicks}>Introduction</p>
                        </div>
                        <div className="rights">
                            <ul>
                                <li>
                                    <p>Last Price</p>
                                    <span className={hit.change < 0?'minus':'plus'}>{hit.last}</span> {hit.symbol}
                                </li>
                                <li>
                                    <p>24H Change</p>
                                    <span className={hit.change < 0?'minus':'plus'}>{hit.change} {hit.symbol}</span>
                                </li>
                                <li>
                                    <p>24H High</p>
                                    <span>{hit.high} </span> {hit.symbol}
                                </li>
                                <li>
                                    <p>24H Low</p>
                                    <span>{hit.low} </span> {hit.symbol}
                                </li>
                                
                                <li>
                                    <p>24H Volume </p>
                                    <span>{hit.volume} </span> {hit.symbol}
                                </li>
                            </ul>
                        </div>
                        </div>
                        )}
                        
                        <div className="openDetail clearfix">
                            <div className="contrct">
                                <p><strong>Total Supply</strong>{this.state.items.max_supply}</p>
                                <p><strong>Circulating</strong>{this.state.items.supply}</p>
                                <p><strong>Contract</strong>{this.state.items.issuer}</p>
                                <p><strong>Website</strong>http://{symbol}.com</p>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        )
    }
}

export default tradingHead;