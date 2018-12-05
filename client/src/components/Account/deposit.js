import React, {Component} from 'react';
import lodash from 'lodash';
import axios from'axios';

class Deposit extends Component{
    constructor(props){
        super(props);
        this.state = {
            mortgage: true,
            value: 0
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }
    componentDidMount() {
        if(this.props.newUser) {
            let balance = axios(`https://api.byzanti.ne/balance?account=${this.props.account.name}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
            console.log(balance);
        }
    }

    loadData(e) {
        this.setState({value: e.target.value})
    }

    sendData() {
        this.props.deposit(this.state.value, this.props.symbView);
    }
    render(){
        let balInd = lodash.findIndex(this.props.balance, ['token', this.props.symbView]);
        let bal = this.props.balance[balInd];

        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>Deposit</h4>
                    <ul><input onChange={this.loadData} type="number"></input>{this.props.symbView} <button id="confirm" onClick={this.sendData}>Confirm</button></ul>
                    <ul id="bal">Exchange balance: {(Number(bal.amount)+Number(this.state.value)).toFixed(4)} {this.props.symbView}</ul>
                    <ul id="bal" style={this.state.value > bal.amount ? {color: 'red'} :  null}>Chain balance: {(Number(bal.chainBal)-Number(this.state.value)).toFixed(this.props.tokens[this.props.symbView].precision)} {this.props.symbView}</ul><br/>
                    <ul>Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.</ul>
                </div>
            </div>
        )
    }
}

export default Deposit