import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import loader from './imgs/loader.gif';
import $ from "jquery";

import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];


class Home extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          transaction: [],
          transactionTrx: [],
          transactionReceipt: [],
          colors: [],
          logo: [],
        };
      }

    componentDidMount() {
        var url = new URL(window.location.href);
         var trxID = url.searchParams.get("trxID");
         var blocknum = url.searchParams.get("blocknumber");
          var datas = 
   {
       "id": trxID,
       "block_num_hint": blocknum
     };
       fetch('https://cors-anywhere.herokuapp.com/http://eos.byzanti.ne:8888/v1/history/get_transaction', { 
    method: 'POST',headers: {
      
 //  'Accept': 'application/json',
 'Origin': 'http://eos.byzanti.ne:8888/v1/history/get_transaction',
   'Content-Type': 'application/json',
 },  body: JSON.stringify(datas)})
       .then(response => response.json())
         .then(datas => {console.log(datas);this.setState({transaction:datas});this.setState({transactionTrx:datas.trx.trx});this.setState({transactionReceipt:datas.trx.receipt});
       $('#actionAmount').html(datas.trx.trx.actions[0].data.amount);$('#actionBuy').html(datas.trx.trx.actions[0].data.amountbuy);$('#actionSell').html(datas.trx.trx.actions[0].data.amountsell);$('#actionMaker').html(datas.trx.trx.actions[0].data.maker);$('#actionMakerfee').html(datas.trx.trx.actions[0].data.makerfee);
       $('#actionTaker').html(datas.trx.trx.actions[0].data.taker);$('#actionTakerfee').html(datas.trx.trx.actions[0].data.takerfee);$('#actionHex').html(datas.trx.trx.actions[0].hex_data); $('.loader').fadeOut();}
  );

  fetch(adminURL+'/getColors/'+apiId)
    .then(response => response.json())
    .then(data => {if(data.theme_color=='')
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
        const { transaction } = this.state;
        const { transactionTrx } = this.state;
        const { transactionReceipt } = this.state;
        const { colors } = this.state;
       // console.log(this.state.transactionTrx.actions[0]);
        return(
            <div className="HomePage" >
                <div class="transactionPage">
                <div className="loader">
                    <img src={loader} />
                </div>
                    <div className="container">
                        <div className="transTop">
                            <h3>Transaction Id <span>{this.state.transaction.id}</span></h3>
                            <cite style={{'border-color': this.state.colors, 'color':this.state.colors}}>executed</cite>
                            <cite style={{'border-color': this.state.colors, 'color':this.state.colors}}>Irreversible</cite>
                            <p style={{'color':this.state.colors}}>Block Number <span>{this.state.transaction.block_num}</span></p>
                            <p style={{'color':this.state.colors}}>Block Time <span>{this.state.transaction.block_time}</span></p>
                            <p style={{'color':this.state.colors}}>Expiration Time<span>{this.state.transactionTrx.expiration}</span></p>
                            <p style={{'color':this.state.colors}}>Amount <span id="actionAmount"></span></p>
                            <p style={{'color':this.state.colors}}>Amount Buy <span id="actionBuy"></span></p>
                            <p style={{'color':this.state.colors}}>Amount Sell <span id="actionSell"></span></p>
                            <p style={{'color':this.state.colors}}>Maker <span id="actionMaker"></span></p>
                            <p style={{'color':this.state.colors}}>Maker Fee <span id="actionMakerfee"></span></p>
                            <p style={{'color':this.state.colors}}>Taker <span id="actionTaker"></span></p>
                            <p style={{'color':this.state.colors}}>Taker Fee <span id="actionTakerfee"></span></p>
                            <p style={{'color':this.state.colors}}>Hex Data <span id="actionHex" style={{'word-break': 'break-word'}}></span></p>
                            
                            <ul>
                                <li>Ref
                                    <span>{this.state.transactionTrx.ref_block_num}</span>
                                </li>
                                <li>Block
                                    <span>{this.state.transactionTrx.ref_block_prefix}</span>
                                </li>
                                <li>CPU(μs)
                                    <span>{this.state.transactionReceipt.cpu_usage_us}</span>
                                </li>
                                <li>NET(bytes)
                                    <span>{this.state.transactionReceipt.net_usage_words}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="transBottom" style={{'display':'none'}}>
                            <h3>Actions</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Seq</th>
                                        <th>Type</th>
                                        <th>Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1176209489</td>
                                        <td>hirevibeshvt - issue</td>
                                        <td>
                                            40.0699 HVT issued to hazdsojwgyge
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1176209489</td>
                                        <td>hirevibeshvt - issue</td>
                                        <td>
                                            40.0699 HVT issued to hazdsojwgyge
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1176209489</td>
                                        <td>hirevibeshvt - issue</td>
                                        <td>
                                            40.0699 HVT issued to hazdsojwgyge
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1176209489</td>
                                        <td>hirevibeshvt - issue</td>
                                        <td>
                                            40.0699 HVT issued to hazdsojwgyge
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                            <span>Transfer</span>
                                            <p>Action Seq: 1176209490</p>
                                            <p>Action Receiver: hirevibeshvt</p>
                                            <p>airdropsdac5 -> hazdsojwgyge 40.0699 HVT (hirevibeshvt)</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;