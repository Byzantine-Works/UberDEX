import React, {Component} from 'react';
import $ from "jquery";


class CpuManager extends Component{
    constructor(props){
        super(props);
        this.state = {
            mortgage: true
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    loadData(e) {
        this.setState({value: e.target.value})

    }

    sendData() {
        this.props.delegate("cpu", this.state.mortgage, this.state.value);
    }

    render(){
        let styleFocus = {backgroundColor: '#6B76B4', color:'white'}
        return (
            <div className="ToolContainer">
                <button className="returnButton" onClick={() => this.props.changeView("wallet")}>{"< Return"}</button>
                <div className="Tool">
                    <h4>CPU manager</h4>
                    <ul><button id="mortgageCPU" style={this.state.mortgage ? styleFocus : null} onClick={() => this.setState({mortgage: true})}>Mortgage</button>
                        <button id="redeemCPU" style={this.state.mortgage ? null : styleFocus} onClick={() => this.setState({mortgage: false})}>Redeem</button>
                    </ul>

                    <ul>
                        <input onChange={this.loadData}></input>EOS <button id="confirm" onClick={this.sendData}>Confirm</button>
                    </ul>
                    <ul>
                        {this.state.mortgage ? <span>Balance: {this.props.balance} EOS</span> : <span>Redeemable: {this.props.redeem.toFixed(4)} EOS</span>}
                    </ul>
                    <ul>
                        Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.
                    </ul>
                </div>
            </div>
        )
    }
}

export default CpuManager 