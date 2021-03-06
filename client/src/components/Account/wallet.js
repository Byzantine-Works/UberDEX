import React, { Component } from 'react';


class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            zeroBal: false
        }

        this.search = this.search.bind(this);
        this.zeroBalance = this.zeroBalance.bind(this);
    }

    zeroBalance() {
        this.setState({zeroBal: !this.state.zeroBal});
        console.log(this.state.zeroBal);

    }

    search(e){
        this.setState({search: e.target.value.toUpperCase()});
    }

    render() {
       
        return (
            <div className="walletContainer">
                <div>
                <form>
                    <i className="fa fa-search"></i>
                        <input type="text" placeholder="Search" id="searchMarket" onChange={this.search}></input>
                </form>
                <span className="zeroBalance"><input type="checkbox" onChange={this.zeroBalance}/>  Show zero balances </span>
                </div>
                <table>
                    <thead>

                        <tr>
                            <td>Symbol</td>
                            <td>Exchange Balance</td>
                            <td>Contract Actions</td>
                            <td>Chain Balance)</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.balance.map(sym => {
                            if(sym.token.includes(this.state.search) && sym.token !== 'EOS') {
                            return (
                                <tr>
                                    <td><a href={'/exchange/?opt=' + sym.token + '&contract=' + sym.contract}>{sym.token}</a></td>
                                    <td>{Number(sym.amount).toFixed(this.props.tokens[sym.token].precision)}</td>
                                    <td><a id={sym.token} onClick={(e) => this.props.changeView("withdraw", e.target.id)} style={{display:'inline-block'}}>Withdraw</a> / <a id={sym.token} onClick={(e) => this.props.changeView("deposit", e.target.id)} style={{display:'inline-block'}}>Deposit</a> / <a id={sym.token} onClick={(e) => this.props.changeView("transfer", e.target.id)} style={{display:'inline-block'}}>Transfer</a></td>
                                    <td>{Number(sym.chainBal).toFixed(this.props.tokens[sym.token].precision)}</td>                                 
                                </tr>
                            )
                            } else if(sym.token.includes(this.state.search) && sym.token === 'EOS' ) {
                                return (
                                    <tr>
                                        <td><a href={'/exchange/?opt=' + sym.token + '&contract=' + sym.contract}>{sym.token}</a></td>
                                        <td>{Number(sym.amount).toFixed(this.props.tokens[sym.token].precision)}</td>
                                        <td><a id={sym.token} onClick={(e) => this.props.changeView("withdraw", e.target.id)} style={{display:'inline-block'}}>Withdraw</a> / <a id={sym.token} onClick={(e) => this.props.changeView("deposit", e.target.id)} style={{display:'inline-block'}}>Deposit</a> / <a id={sym.token} onClick={(e) => this.props.changeView("transfer", e.target.id)} style={{display:'inline-block'}}>Transfer</a></td>
                                        <td>{Number(sym.chainBal).toFixed(this.props.tokens[sym.token].precision)}</td>                                 
                                    </tr>
                                )
                            } else  {
                                return null;
                            }
                        })
                        }
                        {this.state.zeroBal ? 
                            this.props.symbols.map(sym => {
                                if(sym.includes(this.state.search)) {
                                return (
                                    <tr>
                                        <td><a>{sym}</a></td>
                                        <td>0.0000</td>
                                        <td></td>
                                        <td>0.0000</td>
                                    </tr>
                                )
                                } else return null
                            }

                            ) : null
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Wallet;