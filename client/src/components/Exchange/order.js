import React, {Component} from 'react';

class Order extends Component{
    
    render(){
       
        return(
            <div className="orderD">
                <div className="container clearfix">
                        
                    <h3>Open Orders</h3>
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
                                <th>Entrusted </th>
                                <th>Status </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
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
        )
    }
}

export default Order;