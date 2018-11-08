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
                
                {Orders.map(order =>
                    
                    <div className="orderWrap" id={'view'+order.orderId}>
                        <div className="orderView">
                            <a href="/" className="closeView"  onClick={closeOrder}><i className="fa fa-times"></i></a>
                            <h3>Order Detail</h3>
                            <div className="viewBottom clearfix">
                                <ul>
                                    <li><span>Account Name</span> <cite>{order.useraccount}</cite> </li>
                                    <li><span>Source</span> <cite>{order.source}</cite> </li>
                                    <li><span>Total</span> <cite>{order.amountBuy} {order.assetBuy}</cite> </li>
                                    <li><span>Price</span> <cite>{order.price}</cite> </li>
                                    <li><span>Fee Discount</span> <cite>{order.feediscount}</cite> </li>
                                    <li><span>Expires</span> <cite>{order.expires}</cite> </li>
                                    <li><span>Type</span> <cite>{order.type}</cite> </li>
                                    <li><span>Time stamp</span> <cite>{order.timestamp}</cite> </li>
                                    <li><span>Date</span> <cite>{order.created}</cite> </li>
                                    <li><span>Order Id</span> <cite className="tradeId">{order.orderId}</cite> </li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                )}
                
            <div className="orderD">
                <div className="container clearfix">
                        
                    <h3>Open Orders</h3>
                    <table className="openOrder">
                        <thead>
                    
                            <tr>
                                <th>Coin</th>
                                <th>Type </th>
                                <th>Order Id </th>
                                <th>Entrusted Time</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Timestamp</th>
                                <th>Entrusted </th>
                                <th>Status </th>
                                <th>Account Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Orders.map(order =>{
                                if(order.cancelled=='1')
                                {
                                    var isCancel='Cancelled';
                                }
                                else
                                {
                                    var isCancel='Active';
                                }
                                if(order.amountBuy>0)
                                {
                                    var amountToShow=order.amountBuy;
                                }
                                else
                                {
                                    var amountToShow=order.amountSell;
                                }
                                
                                var url = new URL(window.location.href);
                                var c = url.searchParams.get("opt");
                                
                                if(order.assetBuy==c)
                                {
                                    return   <tr>
                                        <td className={'plus '+order.assetBuy}  id={order.orderId}  onClick={orderView} >{order.assetBuy}/ {order.assetSell}</td>
                                        <td id={order.orderId}  onClick={orderView}>Buy</td>
                                        <td id={order.orderId}  onClick={orderView}>{order.orderId}</td>
                                        <td id={order.orderId}  onClick={orderView}>{order.created}</td>
                                        <td id={order.orderId}  onClick={orderView}>{parseFloat(order.price).toFixed(4)}</td>
                                        <td id={order.orderId}  onClick={orderView}>{parseFloat(amountToShow).toFixed(4)}</td>
                                        <td id={order.orderId}  onClick={orderView}>{order.created}</td>
                                        <td id={order.orderId}  onClick={orderView}>Yes</td>
                                        <td id={order.orderId}    ><a href="javascript:void(0)" id={order.orderId} onClick={cancelOrder}>{isCancel}</a></td>
                                        <td id={order.orderId}  onClick={orderView}>{order.useraccount}</td>
                                    </tr>
                                }
                                
                          
                            
                            } )}
                        </tbody>
                    </table>
                    

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
                                return <tr>
                                <td className={'plus '+tradebooks.assetBuy}  id={tradebooks.tradeId}  onClick={tackerViews}  >{tradebooks.assetBuy}/ {tradebooks.assetSell}</td>
                                <td id={tradebooks.tradeId}>Sell</td>
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