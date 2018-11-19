import React, {Component} from 'react';
import axios from 'axios';
import lodash from 'lodash';
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';
import Visualizer from './Account/visualizer';
import Wallet from './Account/wallet';
import RamManager from './Account/rammanager';
import CpuManager from './Account/cpumanager';
import NetManager from './Account/netmanager';
import Withdraw from './Account/withdraw';
import Deposit from './Account/deposit';

import  Eos from 'eosjs';
import data from '../app.json';
var color = {background: data['theme_color']};

const socket = openSocket('http://api.byzanti.ne:9090/');

// const network = {
//     blockchain:'eos',
//     protocol:'https://cors-anywhere.herokuapp.com/http',
//     host:'13.52.54.111',
//     eosVersion: 'bf28f8bb',
//     port:8888,
//     chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
//     debug: false,
//     verbose: false,
//     latency: 200,
//     sign: true
// }

const network = { blockchain:'eos',
                protocol:'https',
                host:'proxy.eosnode.tools',
                port:443,
                chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }


class Account extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // accountName: this.props.scatterID.identity.accounts[0].name 
            accountName: 'vernisnotvic',
            view: 'wallet',
            balance: false
        }

        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this)
        this.checkBalance = this.checkBalance.bind(this);
        this.changeView = this.changeView.bind(this);
        this.delegate = this.delegate.bind(this);
        this.manageRam = this.manageRam.bind(this);
        // this.getTokens = this.getTokens.bind(this);
    }
    async getResources(){

        let response = await axios(`https://api.byzanti.ne/getAccount/${this.state.accountName}?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        response = response.data;
    
        let resources = {
            liquidBalance: Number(response.core_liquid_balance.split(' ')[0])*10000,
            staked: response.voter_info.staked,
            ram_quota: response.ram_quota,
            ram_usage: response.ram_usage,
            netWeight: response.net_weight,
            cpuWeight: response.cpu_weight,
            net_limit: response.net_limit,
            cpu_limit: response.cpu_limit,

        };
        this.setState({resources: resources})
    }

    async checkBalance() {
        console.log("state in checkbalance: ", this.state);
        /*Get balance on exchange*/
        let response = await axios('https://api.byzanti.ne/exbalance?account=reddy&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N')
        let balSym = [];
        let balance = response.data.map(el => {
            return {token: el.symbol.split('@')[0], amount: el.amount/Math.pow(10, el.precision), precision: el.precision}
        })
        balance.forEach(async x => {
            balSym.push(x.token);
            if(x.token === 'EOS') {
                x.price = 1;
                x.eosEquivalent = x.amount;
                x.chainBal = this.state.resources.liquidBalance/10000;
                x.chainBalEquivalent = x.chainBal;
            }
            else {
                let price = await axios(`https://api.byzanti.ne/ticker?symbol=${x.token}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`);
                price = price.data.last;
                x.price = price
                x.eosEquivalent = price * x.amount;
            }

        })
        /*Get balance on chain*/

        let tokensByAccount = await axios(`https://api.byzanti.ne/tokensByAccount/vernisnotvic?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        console.log(tokensByAccount);
        await tokensByAccount.data.forEach(async el => {
            if(balSym.includes(el.symbol)) {
                let index = lodash.findIndex(balance, ['token', el.symbol])
                balance[index].chainBal = el.balance;
                balance[index].chainBalEquivalent = el.balance * balance[index].price;
            } else {
                let p = await axios(`https://api.byzanti.ne/ticker?symbol=${el.symbol}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`);
                console.log("price: ", el.precision);
                let obj = {};
                obj.token = el.symbol;
                const nulAm = 0;
                obj.amount = (nulAm).toFixed(el.precision);
                obj.precision = el.precision;
                obj.chainBal = Number(el.balance);
                obj.chainBalEquivalent = (el.balance * p.data[0].last).toFixed(5);
                obj.chainBal = obj.chainBal.toFixed(el.precision); 
                obj.price = p.data[0].last;
                obj.eosEquivalent = 0;
                balance.push(obj);
            }


        });
        this.setState({tokens: tokensByAccount});
        this.setState({balance_tokens: balSym})
        this.setState({balance: balance})
      }

    async getSymbols(){
        console.log("bal array: ", this.state.balance_tokens)
        let response = await axios('https://api.byzanti.ne/symbols?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        let symbols = [];
        response.data.forEach(sym => {
            if(!this.state.balance_tokens.includes(sym.symbol)) symbols.push(sym.symbol);
        })
        this.setState({symbols: symbols})
        this.setState({view: 'wallet'})
    }

    async componentDidMount(){
        await this.getResources()
        await this.checkBalance();
        // await this.getTokens();
        await this.getSymbols();
    }

    async manageRam(buy, value) {
        console.log(arguments);
        const eos = this.props.scatterEOS;
        let resp;
        if(buy){
            value = Number(value).toFixed(4) + ' EOS'
            resp = await eos.buyram(this.props.scatterID.identity.accounts[0].name, this.props.scatterID.identity.accounts[0].name, value);
        } else {
            value = Number(value)
            resp = await eos.sellram(this.props.scatterID.identity.accounts[0].name, value);
        }

        console.log("resp: ", resp);

    }




    /*Actions performed on the chain : Deposit, Withdraw, Delegate*/

    async delegate(resource, mortgage, value) {
        const eos = this.props.scatterEOS;
        console.log(arguments);
        // const options = {
        //     method: 'POST',
        //     headers: { 'content-type': 'application/json', "api_key": "FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N" },
        //     data: JSON.stringify(),
        //     url: `https://api.byzanti.ne/delegate/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`
        //   };   
        // let response = await axios();

        let payload = {
                from: this.props.scatterID.identity.accounts[0].name,
                receiver: this.props.scatterID.identity.accounts[0].name,
                transfer: 0
        };
        value = Number(value);

        if(resource === 'cpu') {
            if(mortgage) {
                payload.stake_cpu_quantity = value.toFixed(4)+' EOS';
                payload.stake_net_quantity = '0.0000 EOS';
            } else {
                payload.unstake_cpu_quantity = value.toFixed(4)+' EOS';
                payload.unstake_net_quantity = '0.0000 EOS';
            }
        }
        else {
            if(mortgage) {
                payload.stake_net_quantity = value.toFixed(4)+' EOS';
                payload.stake_cpu_quantity = '0.0000 EOS';
            } else {
                payload.unstake_net_quantity = value.toFixed(4)+' EOS';
                payload.unstake_cpu_quantity = '0.0000 EOS';

            }
        }
        let resp;
        if(mortgage) resp = await eos.delegatebw(payload);
        else resp = await eos.undelegatebw(payload);

        console.log("paylaod: ", payload);

        console.log("response: ", resp);


    }

    async deposit(quantity, symbol) {
        const eosOptions = { expireInSeconds:60 }
        const eos = this.props.scatterEOS;
        let dep = await eos.transfer(this.props.scatterID.identity.accounts[0].name, 'exchange', Number(quantity).toFixed(4)+' '+symbol, 'deposit');
        console.log("dep: ", dep);
    }

    async withdraw() {
      const eosOptions = { expireInSeconds:60 };
      const scatter = this.props.scatterID;

      const eos = this.props.scatterEOS;
      let info = await eos.getInfo({})
      const expireInSeconds = 600;
      let chainDate = new Date(info.head_block_time + 'Z')
      let expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
      expiration = expiration.toISOString().split('.')[0]

      let block = await eos.getBlock(info.last_irreversible_block_num)

      // let transactionHeaders = {
      //     expiration: new Date(new Date(info.head_block_time + 'Z').getTime() + expireInSeconds * 1000).toISOString().split('.')[0],
      //     ref_block_num: info.last_irreversible_block_num & 0xFFFF,
      //     ref_block_prefix: block.ref_block_prefix
      // }

      let randChannel = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      socket.emit('user', ["FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N", randChannel]);
  
      await socket.on(randChannel, async (data) => {
          // let data = 156;
          console.log("nonce: ", data)
          console.log("public key: ", scatter.identity.publicKey);

      const action = {
              from: 'ideos',
              quantity: '1.1111 EOS@eosio.token',
              nonce: data
          };
       let acts = [{
          account: 'exchange',
          name: 'userwithdraw',
          authorization: [{
              actor: 'ideos',
              permission: 'active'
          }],
          action
      }]
      let actionTrans = {
          contract:'exchange',
          action:'userwithdraw',
          params:['ideos', '1.1111 EOS@eosio.token', data]
      }

      console.log(scatter.identity.accounts[0])
      let transaction = await scatter.createTransaction('eos', [actionTrans], scatter.identity.accounts[0], network);
      console.log(transaction.transaction.actions[0].data);
      
      let transactionHeaders = {
          expiration: transaction.transaction.expiration,
          ref_block_num: transaction.transaction.ref_block_num,
          ref_block_prefix: transaction.transaction.ref_block_prefix,
          delay_sec: 369
      };

      let signature = await scatter.getArbitrarySignature(scatter.identity.publicKey, JSON.stringify(action));
      // let w = await eos.transaction({ actions: acts});

      let payload = {};
      payload.user = 'ideos';
      payload.token = 'EOS';
      payload.amount = 1.1111;
      payload.nonce = data;
      payload.signature = signature;
      payload.headers  = transactionHeaders;
      console.log("payload: ", payload);


      let withdrawApi = await fetch('https://api.byzanti.ne/exwithdrawscatter/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
          method: 'POST',
          headers: {
       //  'Accept': 'application/json',
         'Content-Type': 'application/json'
      },  
          body: JSON.stringify(payload)
      });

       console.log("withdraw ", withdrawApi);
  });


    }

    changeView(frame, symb){
        console.log(arguments)
        if(frame === 'withdraw' || frame === 'deposit') this.setState({symbView: symb});
        this.setState({view: frame})
        

    }

    

    


    render() {
        console.log(this.props.scatterEOS)
        return (
            <div className="AccountPage">
                <div className="accountContainer">
                    {this.state.resources ? <Visualizer accountName={this.state.accountName} resources={this.state.resources} changeView={this.changeView} view={this.state.view}/> : null}
                    {this.state.symbols && this.state.view === 'wallet' ? <Wallet symbols={this.state.symbols} balance={this.state.balance} resources={this.state.resources} deposit={this.deposit} withdraw={this.withdraw} changeView={this.changeView}/> : null}
                    {this.state.view === 'ram' ? <RamManager scatterEOS={this.props.scatterEOS} balance={this.state.resources.liquidBalance/10000} redeem={this.state.resources.staked/10000} manageRam={this.manageRam} changeView={this.changeView}/> : null}
                    {this.state.view === 'cpu' ? <CpuManager balance={this.state.resources.liquidBalance/10000} redeem={this.state.resources.cpuWeight/10000} delegate={this.delegate} changeView={this.changeView}/> : null}
                    {this.state.view === 'net' ? <NetManager balance={this.state.resources.liquidBalance/10000} redeem={this.state.resources.netWeight/10000} delegate={this.delegate} changeView={this.changeView}/> : null}
                    {this.state.view === 'withdraw' ? <Withdraw balance={this.state.balance} withdraw={this.withdraw}  symbView={this.state.symbView} changeView={this.changeView}/>: null}
                    {this.state.view === 'deposit' ? <Deposit balance={this.state.balance} deposit={this.deposit}  symbView={this.state.symbView} changeView={this.changeView}/>: null}

                </div>
            </div>

        )

    }
}

export default Account;