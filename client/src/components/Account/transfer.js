import React, {Component} from 'react';
import lodash from 'lodash';
import axios from 'axios';


class transfer extends Component{
    constructor(props){
        super(props);
        this.state = {
            inputs: { quantity: 0 }
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    async componentDidMount() {
        let resp = await axios('https://api.byzanti.ne/tokens?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        let index = lodash.findIndex(resp.data, ["symbol", this.props.symbView]);
        this.setState({setting: resp.data[index]});
        console.log(this.state.setting);
    }

    loadData(e) {
        let inputs = this.state.inputs;
        inputs[e.target.id] = e.target.value
        this.setState({inputs});

    }

    sendData() {
        let q = Number(this.state.inputs.quantity);
        let quantity = (q.toFixed(this.props.tokens[this.props.symbView].precision) + ' '+ this.props.symbView).toString();
        console.log(quantity);
        this.props.transfer(this.state.inputs.to, quantity, this.state.inputs.memo, this.props.tokens[this.props.symbView].contract);
    }
    render(){
        let balInd = lodash.findIndex(this.props.balance, ['token', this.props.symbView]);
        let bal = this.props.balance[balInd];
        console.log(this.state);
        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>Transfer</h4>
                    <ul><input id="to" placeholder="To" onChange={this.loadData}></input></ul>
                    <ul><input id="quantity" placeholder="Quantity" onChange={this.loadData} ></input></ul>
                    <ul><input id="memo" placeholder="Memo" onChange={this.loadData}></input></ul>
                    <ul><button id="confirmT" onClick={this.sendData}>Send</button></ul>
                    <ul id="bal" style={this.state.inputs.quantity > bal.chainBal ? {color: 'red'} :  null}>Chain balance: {(Number(bal.chainBal)-Number(this.state.inputs.quantity)).toFixed(this.props.tokens[this.props.symbView].precision)} {this.props.symbView}</ul><br/>
                    <ul>Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.</ul>
                </div>
            </div>
        )
    }
}

export default transfer