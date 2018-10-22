import React, {Component} from 'react';
import $ from "jquery";
import TradingViewWidget from 'react-tradingview-widget';

function handleClick(e) {
    e.preventDefault();
    var amount_two = e.target.nextSibling.id;
    var amount_twos = e.target.nextSibling.nextSibling.id;
    var amount = e.target.id;
    console.log(amount_twos);
    document.getElementById('box_one').value = amount;
    document.getElementById('box_two').value = amount_two;
    document.getElementById('result_one').value = amount_twos;
  }

class Home_banner extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          hits: [],
          hits_n: [],
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var API = 'http://api.byzanti.ne:8902/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APIS = 'http://api.byzanti.ne:8902/orders?symbol='+c+'&side=BUY&size=22&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ hits: data }); });
        
        fetch(APIS)
        .then(response => response.json())
        .then(data => {this.setState({ hits_n: data }); });
    }


    render(){
        const { hits } = this.state;
        const { hits_n } = this.state;
       
        return(
            <div className="trading_center">
                <div className="container clearfix">
                    <div className="lefts">
                        <div id="tabs">
                            <ul>
                                <li><a href="#tabs-1">Deep</a></li>
                                <li><a href="#tabs-2">Buy</a></li>
                                <li><a href="#tabs-3">Sell</a></li>
                            </ul>
                            <div id="tabs-1">
                               <table>
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {hits.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {hits_n.map(hitn => 
                                            <tr>
                                                <td className={hitn.price < 0?'minus':'plus'} id={hitn.price}  onClick={handleClick}>{hitn.price}</td>
                                                <td id={hitn.amountBuy}>{hitn.amountBuy}</td>
                                                <td id={hitn.amountSell}>{hitn.amountSell}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div id="tabs-2">
                            <table>
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {hits.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {hits_n.map(hitn => 
                                            <tr>
                                                <td className={hitn.price < 0?'minus':'plus'} id={hitn.price}  onClick={handleClick}>{hitn.price}</td>
                                                <td>{hitn.amountBuy}</td>
                                                <td>{hitn.amountSell}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div id="tabs-3">
                            <table>
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {hits.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                   
                                    <tbody>
                                        {hits_n.map(hitn => 
                                            <tr>
                                                <td className={hitn.price < 0?'minus':'plus'} id={hitn.price}  onClick={handleClick}>{hitn.price}</td>
                                                <td>{hitn.amountBuy}</td>
                                                <td>{hitn.amountSell}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="center">
                         {hits.map(hit =>
                            <TradingViewWidget symbol={hit.symbol} />
                        )}
                        <div className="bottom_dv">
                            <h4>Limit Order </h4>
                            <div className="clearfix">
                                <div>
                                    {hits.map(hit =>
                                        <h6>Buy {hit.symbol} <span>Balance:0.0000 EOS</span></h6>
                                    )}
                                    <label>Price <span>EOS</span> </label>
                                    <input type="text" id="box_one" />
                                    <label>Amount {hits.map(hit =>
                                        <span>{hit.symbol} </span>
                                    )}</label>
                                    <input type="text" id="box_two" />
                                    <label>Total  <span>EOS</span>
                                    </label>
                                    <input type="text"  id="result_one" />
                                    <input type="submit" value="Signin to trade" />
                                </div>
                                <div className="red">
                                    {hits.map(hit =>
                                        <h6>Sell {hit.symbol} <span>Balance:0.0000 EOS</span></h6>
                                    )}
                                    <label>Price <span>EOS</span> </label>
                                    <input type="text"  id="box_three" />
                                    <label>Amount {hits.map(hit =>
                                        <span>{hit.symbol} </span>
                                    )}</label>
                                    <input type="text" id="box_four"/>
                                    <label>Total <span>EOS</span></label>
                                    <input type="text" id="result_two" />
                                    <input type="submit" value="Signin to trade" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h3>Favorites</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Market</th>
                                    <th>Last Price</th>
                                    <th>24h Change <span><i className="fa fa-angle-up"></i><i className="fa fa-angle-down"></i></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Black / EOS</td>
                                    <td className="plus">0.02949</td>
                                    <td className="plus">+11.70%</td>
                                </tr>
                                <tr>
                                    <td>Horus / EOS</td>
                                    <td className="minus">0.00260</td>
                                    <td className="minus">-16.66%</td>
                                </tr>
                                <tr>
                                    <td>Black / EOS</td>
                                    <td className="plus">0.02949</td>
                                    <td className="plus">+11.70%</td>
                                </tr>
                                <tr>
                                    <td>Horus / EOS</td>
                                    <td className="minus">0.00260</td>
                                    <td className="minus">-16.66%</td>
                                </tr>
                                <tr>
                                    <td>Black / EOS</td>
                                    <td className="plus">0.02949</td>
                                    <td className="plus">+11.70%</td>
                                </tr>
                                <tr>
                                    <td>Horus / EOS</td>
                                    <td className="minus">0.00260</td>
                                    <td className="minus">-16.66%</td>
                                </tr>
                            </tbody>
                        </table>
                        <h3>Latest transactions</h3>
                        <table style={{margin: '0px'}}>
                            <thead>
                                <tr>
                                    <th>Price(EOS)</th>
                                    <th>Amount(BLACK)</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="minus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="minus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="minus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                                <tr>
                                    <td className="plus">0.02770</td>
                                    <td> 2623.8549</td>
                                    <td>10-12 09:17:27</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home_banner;