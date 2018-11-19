import React, {Component} from 'react';


class RamManager extends Component{
    constructor(props){
        super(props);
        this.state = {
            buy: true
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    loadData(e) {
        this.setState({value: e.target.value})

    }

    sendData() {
        this.props.manageRam(this.state.buy, this.state.value);
    }

    render(){

        let styleFocusB = {backgroundColor: '#39bf0f', color:'white'};
        let styleFocusS = {backgroundColor: '#fd3f3f', color:'white'}

        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>RAM manager</h4>
                    <ul><button id="buyRAM" style={this.state.buy ? styleFocusB : null} onClick={() => this.setState({buy: true})}>Buy</button>
                        <button id="sellRAM" style={this.state.buy ? null : styleFocusS} onClick={() => this.setState({buy: false})}>Sell</button>
                    </ul>
                        <ul><input onChange={this.loadData}></input>EOS <button id="confirm" onClick={this.sendData}>Confirm</button></ul>
                        <ul>Balance: {this.props.balance} EOS</ul>
                        <ul>Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.</ul>
                </div>
            </div>
        )
    }
}

export default RamManager 