import React, {Component} from 'react';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import $ from "jquery";


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
            useraccount:'',
        };
      }

    
    componentDidMount() {
        
            ScatterJS.plugins( new ScatterEOS() );

            const network = {
                blockchain:'eos',
                protocol:'http',
                host:'13.57.210.230',
                eosVersion: 'bf28f8bb',
                port:8888,
                chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
                debug: false,
            verbose: false,
            latency: 200
            }

            ScatterJS.scatter.connect('My-Apps').then(connected => {
                if(!connected) return false;
                var scatter =ScatterJS.scatter;
                if(scatter.identity)
                {
                     this.setState({useraccount:scatter.identity.accounts[0].name});
             
                var API = 'https://api.byzanti.ne/ordersByUser?user='+this.state.useraccount+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
                var OrderSell = 'https://api.byzanti.ne/orders?symbol=IQ&side=SELL&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
                fetch(API)
                .then(response => response.json())
                .then(data => {this.setState({ Orders: data }); });
                fetch(OrderSell)
                .then(response => response.json())
                .then(data => {this.setState({ OrderSells: data }); });
                }
              
            });
           // console.logthis.state.sc
        //alert(scatter.identity.publicKey);
    }


    render(){
        const { Orders } = this.state;
        const { OrderSells } = this.state;
       
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
                                <th>Entrusted Time</th>
                                <th>Price</th>
                                <th>Average</th>
                                <th>Amount</th>
                                <th>Dealt</th>
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
                                
                          return   <tr>
                                <td className={'plus '+order.assetBuy}  id={order.orderId}  onClick={orderView} >{order.assetBuy}</td>
                                <td id={order.orderId}  onClick={orderView}>{order.type}</td>
                                <td id={order.orderId}  onClick={orderView}>{order.created}</td>
                                <td id={order.orderId}  onClick={orderView}>{order.price}</td>
                                <td id={order.orderId}  onClick={orderView}></td>
                                <td id={order.orderId}  onClick={orderView}>{amountToShow}</td>
                                <td id={order.orderId}  onClick={orderView}>{order.created}</td>
                                <td id={order.orderId}  onClick={orderView}>Yes</td>
                                <td id={order.orderId}    ><a href="javascript:void(0)" id={order.orderId} onClick={cancelOrder}>{isCancel}</a></td>
                                <td id={order.orderId}  onClick={orderView}>{order.useraccount}</td>
                            </tr>
                            
                            } )}
                        </tbody>
                    </table>
                    

                    <h3>Orders History</h3>
                    <table>
                        <thead>
                    
                            <tr>
                                <th>Coin</th>
                                <th>Type </th>
                                <th>Entrusted Time</th>
                                <th>Price</th>
                                <th>Average</th>
                                <th>Amount</th>
                                <th>Dealt</th>
                                <th>Total </th>
                                <th>Status </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        )
    }
}

export default Order;