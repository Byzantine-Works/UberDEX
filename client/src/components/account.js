import React, { Component } from 'react';
import axios from 'axios';
import lodash from 'lodash';
import { Switch, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';
import Visualizer from './Account/visualizer';
import Wallet from './Account/wallet';
import RamManager from './Account/rammanager';
import CpuManager from './Account/cpumanager';
import NetManager from './Account/netmanager';
import Withdraw from './Account/withdraw';
import Deposit from './Account/deposit';
import Transfer from './Account/transfer';

import Eos from 'eosjs';
import data from '../app.json';
var color = { background: data['theme_color'] };

const socket = openSocket('http://api.byzanti.ne:9090/');

const network = {
    blockchain: 'eos',
    protocol: 'https://cors-anywhere.herokuapp.com/http',
    host: '13.52.54.111',
    eosVersion: 'bf28f8bb',
    port: 8888,
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    debug: false,
    verbose: false,
    latency: 200,
    sign: true
}

// const networkM = { blockchain:'eos',
//                 protocol:'https',
//                 host:'proxy.eosnode.tools',
//                 port:443,
//                 chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // accountName: this.props.scatterID.identity.accounts[0].name 
            accountName: 'vernisnotvic',
            view: 'wallet',
            balance: false,
            success: false,
            error: false
        }

        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this)
        this.checkBalance = this.checkBalance.bind(this);
        this.changeView = this.changeView.bind(this);
        this.delegate = this.delegate.bind(this);
        this.manageRam = this.manageRam.bind(this);
        this.transfer = this.transfer.bind(this);
        // this.getTokens = this.getTokens.bind(this);
    }
    async getResources() {

        let response = await axios(`https://api.byzanti.ne/getAccount/vernisnotvic?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        //let response = await axios(`https://api.byzanti.ne/getAccount/${this.props.scatterID.identity.accounts[0].name}?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        console.log("resposne: ", response);
        response = response.data;

        let resources = {
            liquidBalance: Number(response.core_liquid_balance.split(' ')[0]) * 10000,
            staked: response.voter_info.staked,
            redeeming: 0,//Number(response.refund_request.cpu_amount.split(' ')[0]) + Number(response.refund_request.net_amount.split(' ')[0]),
            ram_quota: response.ram_quota,
            ram_usage: response.ram_usage,
            netWeight: response.net_weight,
            cpuWeight: response.cpu_weight,
            net_limit: response.net_limit,
            cpu_limit: response.cpu_limit,

        };
        this.setState({ resources: resources })
    }

    async checkBalance() {

        /*Get balance on exchange*/
        let response = await axios('https://api.byzanti.ne/exbalance?account=ideos&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        console.log("exchange balance: ", response);
        let balSym = [];
        let balance = response.data.map(el => {
            return { token: el.symbol, amount: el.amount }
        })
        balance.forEach(async x => {

            balSym.push(x.token);
            if (x.token === 'EOS') {
                x.price = 1;
                x.eosEquivalent = x.amount;
                x.chainBal = this.state.resources.liquidBalance / 10000;
                x.chainBalEquivalent = x.chainBal;
            }
            // else if (x.token !== 'EOS') {
            //     let price = await axios(`https://api.byzanti.ne/ticker?symbol=${x.token}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`);
            //     price = price.data[0].last;
            //     x.price = price
            //     x.eosEquivalent = price * x.amount;
            // }

        })

        /*Get balance on chain*/

        let tokensByAccount = await axios(`https://api.byzanti.ne/tokensByAccount/vernisnotvic?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        //let tokensByAccount = await axios(`https://api.byzanti.ne/tokensByAccount/${this.props.scatterID.identity.accounts[0].name}?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        console.log(tokensByAccount);
        await tokensByAccount.data.forEach(async el => {
            if (balSym.includes(el.symbol)) {
                let index = lodash.findIndex(balance, ['token', el.symbol])
                balance[index].chainBal = el.balance;
            } else {
                let obj = {};
                obj.token = el.symbol;
                const nulAm = 0;
                obj.amount = (nulAm).toFixed(el.precision);
                obj.precision = el.precision;
                obj.chainBal = Number(el.balance);
                obj.chainBal = obj.chainBal.toFixed(el.precision);
                balance.push(obj);
            }


        });
        this.setState({ tokens: tokensByAccount });
        this.setState({ balance_tokens: balSym })
        this.setState({ balance: balance })
    }

    async getSymbols() {
        console.log("bal array: ", this.state.balance_tokens)
        let response = await axios('https://api.byzanti.ne/symbols?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        console.log("symbols response: ", response);
        let symbols = [];
        response.data.forEach(sym => {
            if (!this.state.balance_tokens.includes(sym.symbol)) symbols.push(sym.symbol);
        })
        this.setState({ symbols: symbols })
        this.setState({ view: 'wallet' })
    }

    async componentDidMount() {
        if(!this.props.scatterID) window.location.href = "/";
        await this.getResources()
        await this.checkBalance();
        // await this.getTokens();
        await this.getSymbols();
    }

    async manageRam(buy, value) {
        if(value.toString().includes('.')) {
            this.setState({
                error: {
                    message: 'The value needs to be a whole number'
                },
                success: false
            })

        }
        console.log(arguments);
        const eos = this.props.scatterEOS;
        let resp;
        try {
        if (buy) {
            value = Number(value)
            resp = await eos.buyrambytes(this.props.scatterID.identity.accounts[0].name, this.props.scatterID.identity.accounts[0].name, value);
            if (resp.broadcast && buy) {
                this.setState({
                    success: {
                        message: 'Buying RAM succeeded!',
                        trx: resp.transaction_id
                    },
                    error: false
                })
            }
        } else {
            value = Number(value)
            resp = await eos.sellram(this.props.scatterID.identity.accounts[0].name, value);
            if (resp.broadcast && !buy) {
                this.setState({
                    success: {
                        message: 'Selling RAM succeeded!',
                        trx: resp.transaction_id
                    },
                    error: false
                })
            }
        }
    } catch(e) {
        if(typeof e === 'string') {
            e = JSON.parse(e);
            this.setState({
                error: {
                    message: 'Error: ' + e.error.details[0].message
                },
                success: false
            })
        } else console.log(e);
        
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

        if (resource === 'cpu') {
            if (mortgage) {
                payload.stake_cpu_quantity = value.toFixed(4) + ' EOS';
                payload.stake_net_quantity = '0.0000 EOS';
            } else {
                payload.unstake_cpu_quantity = value.toFixed(4) + ' EOS';
                payload.unstake_net_quantity = '0.0000 EOS';
            }
        }
        else {
            if (mortgage) {
                payload.stake_net_quantity = value.toFixed(4) + ' EOS';
                payload.stake_cpu_quantity = '0.0000 EOS';
            } else {
                payload.unstake_net_quantity = value.toFixed(4) + ' EOS';
                payload.unstake_cpu_quantity = '0.0000 EOS';

            }
        }
        let resp;
        try {
        if (mortgage) resp = await eos.delegatebw(payload);
        else resp = await eos.undelegatebw(payload);
        if (resp.broadcast && mortgage) {
            this.setState({
                success: {
                    message: 'Mortgage succeeded!',
                    trx: resp.transaction_id
                },
                error: false
            })
        } else if (resp.broadcast && !mortgage) {
            this.setState({
                success: {
                    message: 'Redeem succeeded!',
                    trx: resp.transaction_id
                },
                error : false
            }) 
        }  else if (resp.broadcast && !mortgage) {
            this.setState({
                success: {
                    message: 'Error',
                    trx: resp.transaction_id
                },
                error: false
            })
        }

        console.log("response: ", resp);
    } catch(e) {
        if(typeof e === 'string') {
            e = JSON.parse(e);
            this.setState({
                error: {
                    message: 'Error: ' + e.error.details[0].message
                },
                success: false
            })
        } else console.log(e);
    }


    }

    async deposit(quantity, symbol) {
        const eosOptions = { expireInSeconds: 60 }
        const eos = this.props.scatterID.eos(network, Eos, eosOptions);
        let contract = await eos.contract('eosio.token')
        console.log("payload deposit: ", this.props.scatterID.identity.accounts[0].name, 'exchange', Number(quantity).toFixed(4) + ' ' + symbol, 'deposit')
        let dep = await contract.transfer(this.props.scatterID.identity.accounts[0].name, 'exchange', Number(quantity).toFixed(4) + ' ' + symbol, 'deposit');
        console.log("dep: ", dep);
    }

    async withdraw() {
        const eosOptions = { expireInSeconds: 60 };
        const scatter = this.props.scatterID;
        let account = scatter.identity.accounts[0].name
        console.log(account);

        const offlineNetwork = {
            blockchain: 'eos',
            protocol: 'https://cors-anywhere.herokuapp.com/http',
            host: '13.52.54.111',
            eosVersion: 'bf28f8bb',
            port: 8888,
            chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            debug: false,
            verbose: false,
            latency: 200,
            sign: true,
            broadcast: false
        }

        const eos = scatter.eos(offlineNetwork, Eos);



        let exnonce = await axios(`https://api.byzanti.ne/exnonce?account=${account}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
        exnonce = exnonce.data.nonce
        console.log(exnonce);



        const action = {
            admin: 'admin',
            from: account,
            quantity: '1.0000 EOS@eosio.token',
            nonce: exnonce
        };


        const offlineOptions = {
            broadcast: false,
            sign: true,
            authorization: [{
                actor: account,
                permission: 'active'
            },
            {
                actor: 'admin',
                permission: 'active'
            }
            ],
        };


        let exchange = await eos.contract('exchange');
        console.log("exchange: ", exchange);
        let offTransaction = await exchange.withdraw(action, offlineOptions);
        console.log(offTransaction);



        let payload = {};
        payload.user = account;
        payload.token = 'EOS';
        payload.amount = 1.0000;
        payload.nonce = exnonce;
        payload.signature = offTransaction.transaction.signatures[0];
        payload.headers = offTransaction.transaction.transaction;

        console.log(payload)



        let withdrawApi = await fetch('https://api.byzanti.ne/exwithdrawscatter/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
            method: 'POST',
            headers: {
                //  'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log("withdraw ", withdrawApi);



    }

    transfer(to, quantity, memo) {
        const eosOptions = { expireInSeconds: 60 }
        const eos = this.props.scatterID.eos(network, Eos, eosOptions);
        eos.transfer(this.props.scatterID.accounts[0].name, to, quantity, memo);

    }

    changeView(frame, symb) {
        this.setState({error: false, success: false});
        console.log(arguments)
        if (frame === 'withdraw' || frame === 'deposit' || frame === 'transfer') this.setState({ symbView: symb });
        this.setState({ view: frame })
    }








    render() {
        console.log(this.props.scatterEOS)
        let success = <div className="successMessage">{this.state.success.message} Checkout the transaction: <a href={`https://eosflare.io/tx/${this.state.success.trx}`} target="_blank">{this.state.success.trx}</a></div>
        let error = <div className="errorMessage">{this.state.error.message}</div>

        
        return (
            <div className="AccountPage">
                <div className="accountContainer">
                    {this.state.resources ? <Visualizer accountName={this.state.accountName} resources={this.state.resources} changeView={this.changeView} view={this.state.view} /> : null}
                    {this.state.symbols && this.state.view === 'wallet' ? <Wallet symbols={this.state.symbols} balance={this.state.balance} resources={this.state.resources} deposit={this.deposit} withdraw={this.withdraw} changeView={this.changeView} /> : null}
                    {this.state.view === 'ram' ? <RamManager scatterEOS={this.props.scatterEOS} balance={this.state.resources.liquidBalance / 10000} redeem={this.state.resources.staked / 10000} manageRam={this.manageRam} changeView={this.changeView} updateSuccess={this.updateSuccess} /> : null}
                    {this.state.view === 'cpu' ? <CpuManager balance={this.state.resources.liquidBalance / 10000} redeem={this.state.resources.cpuWeight / 10000} delegate={this.delegate} changeView={this.changeView} updateuccess={this.updateSuccess} /> : null}
                    {this.state.view === 'net' ? <NetManager balance={this.state.resources.liquidBalance / 10000} redeem={this.state.resources.netWeight / 10000} delegate={this.delegate} changeView={this.changeView} updateSuccess={this.updateSuccess} /> : null}
                    {this.state.view === 'withdraw' ? <Withdraw balance={this.state.balance} withdraw={this.withdraw} symbView={this.state.symbView} changeView={this.changeView} updateSuccess={this.updateSuccess} /> : null}
                    {this.state.view === 'deposit' ? <Deposit balance={this.state.balance} deposit={this.deposit} symbView={this.state.symbView} changeView={this.changeView} updateSuccess={this.updateSuccess} /> : null}
                    {this.state.view === 'transfer' ? <Transfer balance={this.state.balance} deposit={this.deposit} symbView={this.state.symbView} changeView={this.changeView} updateSuccess={this.updateSuccess} /> : null}
                    {this.state.success ? success : null}
                    {this.state.error ? error : null}
                </div>
            </div>

        )

    }
}

export default Account;