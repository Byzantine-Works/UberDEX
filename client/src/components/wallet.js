import React, {Component} from 'react';


class Wallet extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props)
        
        return (
            <div className="walletContainer">
                <table>
                    <thead>
                        <tr>
                            <td>Symbol</td>
                            <td>Available (on Exchange)</td>
                            <td>Frozen (on Exchange)</td>
                            <td>EOS valuation (on Exchange)</td>
                            <td></td>
                            <td>Available (on EOS chain)</td>
                            <td>EOS valuation (on EOS chain)</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.balance.map(sym => {
                            return (
                                <tr>
                                    <td><a href={'/exchange/?opt='+sym.token}>{sym.token}</a></td>
                                    <td>{sym.amount}</td>
                                    <td>0.0000</td>
                                    <td>{sym.eosEquivalent}</td>
                                    <td><a id={sym.token} onClick={(e)=>this.props.changeView("withdraw", e.target.id)}>Withdraw</a> / <a id={sym.token}  onClick={(e)=>this.props.changeView("deposit", e.target.id)}>Deposit</a></td>
                                    <td>{sym.chainBal}</td>
                                    <td>{sym.chainBalEquivalent}</td>
                                </tr>
                            )
                        })
                        }
                        {
                            this.props.symbols.map(sym => {
                                return (
                                    <tr>
                                        <td><a href={'/exchange/?opt='+sym.token}>{sym}</a></td>
                                        <td>0.0000</td>
                                        <td>0.0000</td>
                                        <td>0.0000</td>
                                        <td><a onClick={this.withdraw}>Withdraw</a> / <a onClick={this.deposit}>Deposit</a></td>
                                        <td>0.0000</td>
                                        <td>0.0000</td>
                                    </tr>
                                )
                            }

                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Wallet;