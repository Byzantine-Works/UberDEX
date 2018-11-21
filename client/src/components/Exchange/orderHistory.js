import React, {Component} from 'react';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import $ from "jquery";

function tackerViews(e) {
    e.preventDefault();
    var views = e.target.id;
    $('#views'+views).fadeIn();
}
function closeViews(e){
    e.preventDefault();
    $('.tradeWrap').fadeOut();
}


function orderView(e) {
    e.preventDefault();
    var views = e.target.id;
  //  console.log(views);
    $('#view'+views).fadeIn();
}
function closeOrder(e){
    e.preventDefault();
    $('.orderWrap').fadeOut();
}

function cancelOrder(e){
    e.preventDefault();
     var order_id = e.target.id;
     $('#view'+order_id).fadeOut();
       let datas = {
          "orderId": order_id,
  "orderHash": "ascascasc"
    };
     fetch('https://api.byzanti.ne/orderCancel?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
     method: 'POST',headers: {
  //  'Accept': 'application/json',
    'Content-Type': 'application/json',
  },  body: JSON.stringify(datas)})
        .then(response => response.json())
        .then(data => window.location.reload());
        
}
class Order extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            Orders: [],
            OrderSells: [],
            tradebook: [],
            useraccount:'',
        };
      }

    
    componentDidMount() {

        var url = new URL(window.location.href);
         var c = url.searchParams.get("opt");

                var tradebook = 'https://api.byzanti.ne/tradebook?symbol='+c+'&size=10&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
                var API = 'https://api.byzanti.ne/ordersByUser?user=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
                var OrderSell = 'https://api.byzanti.ne/orders?symbol=IQ&side=SELL&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
                fetch(API)
                .then(response => response.json())
                .then(data => {this.setState({ Orders: data }); });
                fetch(OrderSell)
                .then(response => response.json())
                .then(data => {this.setState({ OrderSells: data }); });
                
                fetch(tradebook)
                .then(response => response.json())
                .then(data => {this.setState({ tradebook: data }); });
                
           // console.logthis.state.sc
        //alert(scatter.identity.publicKey);
    }


    render(){
        const { Orders } = this.state;
        const { OrderSells } = this.state;
        const { tradebook } = this.state;
       
        return(
            <div>
                
            <div className="myOrders">
                    <h3>Orders History</h3>
                    <table>
                        <thead>
                    
                            <tr>
                                <th>Coin</th>
                                <th>Type </th>
                                <th>Trade ID </th>
                                <th>Entrusted Time</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Timestamp</th>
                                <th>Entrusted </th>
                                <th>Taker </th>
                                <th>Maker </th>
                            </tr>
                        </thead>
                        <tbody>
                        {tradebook.map(tradebooks =>{
                            if(tradebooks.taker=='taker1')
                            {
                                if(tradebooks.assetBuy=='EOS')
                                {
                                    var sides= 'Sell';
                                }
                                else
                                {
                                    var sides='Buy';
                                }
                                return <tr>
                                <td className={'plus '+tradebooks.assetBuy}  id={tradebooks.tradeId}  onClick={tackerViews}  >{tradebooks.assetBuy}</td>
                                <td id={tradebooks.tradeId}>{sides}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.tradeId}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.created}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.price}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.amountBuy}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.created}</td>
                                <td id={tradebooks.tradeId}>Yes</td>
                                <td id={tradebooks.tradeId}>{tradebooks.taker}</td>
                                <td id={tradebooks.tradeId}>{tradebooks.maker}</td>
                            </tr>
                            }
                            
                        }
                            )}
                        </tbody>
                    </table>
                
            </div>

            {tradebook.map(tradebooks =>
                    
                    <div className="tradeWrap" id={'views'+tradebooks.tradeId}>
                        <div className="tradeView">
                            <a href="/" className="closeView"  onClick={closeViews}><i className="fa fa-times"></i></a>
                            <div className="viewTop">
                                <ul>
                                    <li><span>Price</span>{tradebooks.price} EOS</li>
                                    <li><span>Volume</span>{tradebooks.amountBuy} {tradebooks.assetBuy}</li>
                                    <li><span>Total</span>{tradebooks.amountSell} EOS</li>
                                    <li><span>Date</span> {tradebooks.created}</li>
                                </ul>
                            </div>
                            <div className="viewBottom clearfix">
                                <ul>
                                    <li><h3>Maker</h3></li>
                                    <li><span>EOS Account Name</span> <cite>{tradebooks.maker}</cite> </li>
                                    <li><span>Total</span> <cite>{tradebooks.amountBuy} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Fee</span> <cite>{tradebooks.makerFee} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Maker Exchange</span> {tradebooks.makerExchange} <cite></cite> </li>
                                    <li><span>Time stamp</span> <cite>{tradebooks.timestamp}</cite> </li>
                                    <li><span>Trade Id</span> <cite className="tradeId">{tradebooks.tradeId}</cite> </li>
                                    
                                </ul>
                                
                                <ul>
                                    <li><h3>Taker</h3></li>
                                    <li><span>EOS Account Name</span> <cite>{tradebooks.taker}</cite> </li>
                                    <li><span>Total</span> <cite>{tradebooks.amountSell} EOS</cite> </li>
                                    <li><span>Fee</span> <cite>{tradebooks.takerFee} EOS</cite> </li>
                                    <li><span>Taker Exchange</span> <cite>{tradebooks.takerExchange}</cite> </li>
                                    <li><span>Time stamp</span> <cite>{tradebooks.timestamp}</cite> </li>
                                    <li><span>Trade Id</span> <cite className="tradeId">{tradebooks.tradeId}</cite> </li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                )}
        </div>
        )
    }
}

export default Order;