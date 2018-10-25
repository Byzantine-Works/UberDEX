import React, {Component} from 'react';
import $ from "jquery";
import TradingViewWidget from 'react-tradingview-widget';

function handleClick(e) {
    e.preventDefault();
    var amount_two = e.target.nextSibling.id;
    var amount_twos = e.target.nextSibling.nextSibling.id;
    var amount = e.target.id;
    console.log(amount_twos);
    document.getElementById('price').value = amount;
    document.getElementById('buyPrice').value = amount_two;
    document.getElementById('sellPrice').value = amount_twos;
  }
  
function handleClicks(e) {
    e.preventDefault();
    var amount_four = e.target.nextSibling.id;
    var amount_fours = e.target.nextSibling.nextSibling.id;
    var amounts = e.target.id;
    document.getElementById('priceTwo').value = amounts;
    document.getElementById('BuyPricetwo').value = amount_four;
    document.getElementById('sellPricetwo').value = amount_fours;
  }

class tradingHead extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
          orders: [],
          orderBook: [],
          orderBooks: [],
        };
      }


    
    componentDidMount() {
        
        var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var API = 'http://api.byzanti.ne:8902/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APIS = 'http://api.byzanti.ne:8902/orderBook?symbol='+c+'&side=BUY&size=11&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APISS = 'http://api.byzanti.ne:8902/orders?symbol='+c+'&side=BUY&size=22&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ tricker: data }); });
        
        fetch(APISS)
        .then(response => response.json())
        .then(data => {this.setState({ orders: data }); });
        
        fetch(APIS)
        .then(response => response.json())
        .then(data => {this.setState({ orderBook: data['asks'], orderBooks: data['bids'] }); });
    }


    render(){
        const { tricker } = this.state;
        const { orders } = this.state;
        const { orderBook } = this.state;
        const { orderBooks } = this.state;
       
        return(
            <div className="tradingCenter">
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
                                            {tricker.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {orderBooks.map(bids => 
                                            <tr>
                                                <td className='minus' id={bids.price}  onClick={handleClicks}>{bids.price}</td>
                                                <td id={bids.amountBuy}>{bids.amountBuy}</td>
                                                <td id={bids.amountSell}>{bids.amountSell}</td>
                                            </tr>
                                        )}
                                        {orderBook.map(ask => 
                                            <tr>
                                                <td className='plus' id={ask.price}  onClick={handleClick}>{ask.price}</td>
                                                <td id={ask.amountBuy}>{ask.amountBuy}</td>
                                                <td id={ask.amountSell}>{ask.amountSell}</td>
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
                                            {tricker.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {orderBook.map(ask => 
                                            <tr>
                                                <td className='plus' id={ask.price}  onClick={handleClick}>{ask.price}</td>
                                                <td id={ask.amountBuy}>{ask.amountBuy}</td>
                                                <td id={ask.amountSell}>{ask.amountSell}</td>
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
                                            {tricker.map(hit => <th>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                    </tr>
                                    </thead>
                                    
                                   
                                    <tbody>
                                        {orderBooks.map(bids => 
                                            <tr>
                                                <td className='minus' id={bids.price}  onClick={handleClicks}>{bids.price}</td>
                                                <td id={bids.amountBuy}>{bids.amountBuy}</td>
                                                <td id={bids.amountSell}>{bids.amountSell}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="center">
                         {tricker.map(hit =>
                            <TradingViewWidget symbol={hit.symbol+'/EOS'} />
                        )}
                        <div className="calculator">
                            <h4>Limit Order </h4>
                            <div className="clearfix">
                                <div>
                                    {tricker.map(hit =>
                                        <h6>Buy {hit.symbol} <span>Balance:0.0000 EOS</span></h6>
                                    )}
                                    <label>Price <span>EOS</span> </label>
                                    <input type="text" id="price" />
                                    <label>Amount {tricker.map(hit =>
                                        <span>{hit.symbol} </span>
                                    )}</label>
                                    <input type="text" id="buyPrice" />
                                    <label>Total  <span>EOS</span>
                                    </label>
                                    <input type="text"  id="sellPrice" />
                                    <input type="submit" value="Signin to trade" />
                                </div>
                                <div className="red">
                                    {tricker.map(hit =>
                                        <h6>Sell {hit.symbol} <span>Balance:0.0000 EOS</span></h6>
                                    )}
                                    <label>Price <span>EOS</span> </label>
                                    <input type="text"  id="priceTwo" />
                                    <label>Amount {tricker.map(hit =>
                                        <span>{hit.symbol} </span>
                                    )}</label>
                                    <input type="text" id="BuyPricetwo"/>
                                    <label>Total <span>EOS</span></label>
                                    <input type="text" id="sellPricetwo" />
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

export default tradingHead;