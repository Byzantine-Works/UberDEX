import React, {Component} from 'react';
import axios from 'axios';


class RamManager extends Component{
    constructor(props){
        super(props);
        this.state = {
            buy: true,
            value: 0
        }

        this.loadData = this.loadData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    async componentDidMount() {
        let ramresp = await axios('https://api.byzanti.ne/getRamPrice?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
        let ramPrice = ramresp.data.price_per_kb_eos;
        this.setState({ramPrice});

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
                        <ul><input onChange={this.loadData} type="number"></input>bytes <button id="confirm" onClick={this.sendData}>Confirm</button></ul>
                        <ul id="bal" style={((this.state.ramPrice/1000)*this.state.value) > this.props.balance ? {color: 'red'} : null}>EOS equivalent: {((this.state.ramPrice/1000)*this.state.value).toFixed(4)} EOS</ul>
                        <ul id="bal">Balance: {this.props.balance} EOS</ul>
                        <br/>
                        Resources can be redeemed at any time, EOS will be returned to your account in 3 days. Transfer or vote will cost some CPU and NET resources.
                </div>
            </div>
        )
    }
}

export default RamManager 