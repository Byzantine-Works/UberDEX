import React, {Component} from 'react';
import Header from './header';
import Footer from './footer';
import data from '../app.json';
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
       .then(data => {console.log(data);this.setState({transaction:data});this.setState({transactionTrx:data.trx.trx});this.setState({transactionReceipt:data.trx.receipt});}
   );

}
    render(){
        const { transaction } = this.state;
        const { transactionTrx } = this.state;
        const { transactionReceipt } = this.state;
        
        return(
            <div className="HomePage" >
                <div className="wellcomBanner background" style={color}>
                    <Header />
                </div>
                <div class="transactionPage">
                    <div className="container">
                        <div className="transTop">
                            <h3>Transaction Id <span>{this.state.transaction.id}</span></h3>
                            <cite>executed</cite> <cite>Irreversible</cite>
                            <p>Block Time <span>{this.state.transaction.block_time}</span></p>
                            <p>Expiration Time<span>{this.state.transactionTrx.expiration}</span></p>
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