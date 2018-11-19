import React, {Component} from 'react';
import lodash from 'lodash';


class Withdraw extends Component{
    constructor(props){
        super(props);
        this.state = {
            mortgage: true,
            value: 0
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    loadData(e) {
        this.setState({value: e.target.value})

    }

    sendData() {
        this.props.withdraw(this.props.symbView, this.state.value);
    }
    render(){
        console.log("props in withdraw: ", this.props);
        let balInd = lodash.findIndex(this.props.balance, ['token', this.props.symbView]);
        let bal = this.props.balance[balInd];

        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>Withdraw</h4>
                    <ul><input onChange={this.loadData} type="number"></input>{this.props.symbView} <button id="confirm" onClick={this.sendData}>Confirm</button></ul>
                    <ul id="bal" style={this.state.value > bal.amount ? {color: 'red'} :  null}>Exchange balance: {(bal.amount-this.state.value).toFixed(4)} {this.props.symbView}</ul>
                    <ul id="bal">Chain balance: {Number(bal.chainBal)+Number(this.state.value)} {this.props.symbView}</ul><br/>
                    <ul>Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.</ul>
                </div>
            </div>
        )
    }
}

export default Withdraw