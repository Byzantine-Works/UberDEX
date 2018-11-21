import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import data from '../app.json';
import $ from "jquery";

var color = {background: data['theme_color']};
var logoUrl = data['logo'];
console.log(logoUrl);


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
         .then(datas => {var ab=234;console.log(ab.toFixed(2));this.setState({transaction:datas});this.setState({transactionTrx:datas.trx.trx});this.setState({transactionReceipt:datas.trx.receipt});
       $('#actionAmount').html(datas.trx.trx.actions[0].data.amount);$('#actionBuy').html(datas.trx.trx.actions[0].data.amountbuy);$('#actionSell').html(datas.trx.trx.actions[0].data.amountsell);$('#actionMaker').html(datas.trx.trx.actions[0].data.make);$('#actionMakerfee').html(datas.trx.trx.actions[0].data.makerfee/10000);
       $('#actionTaker').html(datas.trx.trx.actions[0].data.taker);$('#actionTakerfee').html(datas.trx.trx.actions[0].data.takerfee/10000);$('#actionHex').html(datas.trx.trx.actions[0].hex_data);}
  );

   fetch('https://uberdex-admin.herokuapp.com/getColors')
    .then(response => response.json())
    .then(data => {if(data.theme_color=='')
    {
        this.setState({colors:'#0e9caf'});
    }
    else
    {
        this.setState({colors:data.theme_color}); this.setState({logo:'https://uberdex-admin.herokuapp.com/images/byzantine/'+data.logo});
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
                <div className="wellcomBanner background"  style={{'background': this.state.colors}}>
                    <Header />
                </div>
                <div class="transactionPage">
                    <div className="container">
                        <div className="transTop">
                            <h3>Transaction Id <span>{this.state.transaction.id}</span></h3>
                            <cite>executed</cite> <cite>Irreversible</cite>
                            <p>Block Number <span>{this.state.transaction.block_num}</span></p>
                            <p>Block Time <span>{this.state.transaction.block_time}</span></p>
                            <p>Expiration Time<span>{this.state.transactionTrx.expiration}</span></p>
                            <p>Amount <span id="actionAmount"></span></p>
                            <p>Amount Buy <span id="actionBuy"></span></p>
                            <p>Amount Sell <span id="actionSell"></span></p>
                            <p>Maker <span id="actionMaker"></span></p>
                            <p>Maker Fee <span id="actionMakerfee"></span></p>
                            <p>Taker <span id="actionTaker"></span></p>
                            <p>Taker Fee <span id="actionTakerfee"></span></p>
                            <p>Hex Data <span id="actionHex" style={{'word-break': 'break-word'}}></span></p>
                            
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
                <Footer />
            </div>
        )
    }
}

export default Home;