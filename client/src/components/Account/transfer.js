import React, {Component} from 'react';
import lodash from 'lodash';


class transfer extends Component{
    constructor(props){
        super(props);
        this.state = {
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    loadData(e) {
        this.state[e.target.id] = e.target.value;

    }

    sendData() {
        this.props.transfer(this.state.to, this.state.quantity, this.state.memo);
    }
    render(){
        console.log(this.props.balance, this.props.symbView)
        let balInd = lodash.findIndex(this.props.balance, ['token', this.props.symbView]);
        let bal = this.props.balance[balInd];
        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>Transfer</h4>
                    <ul>To: <input id="to" onChange={this.loadData}></input></ul>
                    <ul>Quantity: <input id="quantity" onChange={this.loadData} type="number"></input></ul>
                    <ul>Memo: <input id="memo" onChange={this.loadData}></input></ul>
                    <ul><button id="confirm" onClick={this.sendData}></button></ul>
                    <ul id="bal" style={this.state.value > bal.amount ? {color: 'red'} :  null}>Chain balance: {Number(bal.chainBal)-Number(this.state.value)} {this.props.symbView}</ul><br/>
                    <ul>Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.</ul>
                </div>
            </div>
        )
    }
}

export default transfer