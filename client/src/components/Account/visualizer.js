import React, { Component } from 'react';


class Visualizer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let styleFrame = { border: 'solid', borderWidth: '0.5px', backgroundColor: 'rgba(0, 0, 0, 0.15)' };
        let styleStaking = { border: 'solid', borderWidth: '0.5px', borderColor: 'rgba(0, 0, 0, 0.11)' };
        console.log("resources: ", (this.props.resources.ram_usage / this.props.resources.ram_quota));

        return (
            <div className="visualizerContainer">
                <span><h2>{this.props.accountName}</h2></span>
                <span className="empty"></span>
                <span className="generalBal">
                    {/* <ul><button className="resourcesManagement">Resources Management</button></ul> */}
                    <ul><h3>{(this.props.resources.liquidBalance + this.props.resources.staked) / 10000} EOS</h3></ul>
                </span>

                <div id="available">
                    Available
                    <div id="full" style={styleStaking}>
                        <div style={{ backgroundColor: 'white', width: `${this.props.resources.liquidBalance / (this.props.resources.liquidBalance + this.props.resources.staked) * 300}px` }}>
                        </div>
                    </div>
                    {(this.props.resources.liquidBalance / 10000).toFixed(4)} EOS
                </div>
                <div id="staked">
                    Staked
                    <div id="full" style={styleStaking}>
                        <div style={{ backgroundColor: 'white', width: `${this.props.resources.staked / (this.props.resources.liquidBalance + this.props.resources.staked) * 300}px` }}>
                        </div>
                    </div>
                    {(this.props.resources.staked / 10000).toFixed(4)} EOS
                </div>
                <div id="redeeming">
                    Redeeming
                    <div id="full" style={styleStaking}>
                        <div style={{ backgroundColor: 'white', width: `${(0 / this.props.resources.liquidBalance) * 300}px` }}>
                        </div>
                        {(this.props.resources.redeeming).toFixed(4)} EOS
                    </div>
                </div>

                <div id="ram" onClick={() => this.props.changeView('ram')} style={this.props.view === 'ram' ? styleFrame : { border: 'none' }}>
                    RAM
                    <div id="full" style={{ background: `linear-gradient(90deg, rgb(255, 208, 0) ${(this.props.resources.ram_usage / this.props.resources.ram_quota) * 100}%, rgba(255, 208, 0, 0.384) ${(this.props.resources.ram_usage / this.props.resources.ram_quota) * 100}%)` }}>
                    </div>
                    {(this.props.resources.ram_usage / 1000).toFixed(3)} Kb / {(this.props.resources.ram_quota / 1000).toFixed(3)} Kb
                </div>

                <div id="cpu" onClick={() => this.props.changeView('cpu')} style={this.props.view === 'cpu' ? styleFrame : { border: 'none' }}>
                    CPU
                    <div id="full" style={{ backgroundImage: `linear-gradient(90deg, #6B76B4 ${(this.props.resources.cpu_limit.used / this.props.resources.cpu_limit.max) * 100}%, rgba(107, 118, 180, 0.295) ${(this.props.resources.cpu_limit.used / this.props.resources.cpu_limit.max) * 100}%` }}>
                    </div>
                    {(this.props.resources.cpu_limit.used / 1000).toFixed(3)} ms / {(this.props.resources.cpu_limit.max / 1000).toFixed(3)} ms
                </div>

                <div id="net" onClick={() => this.props.changeView('net')} style={this.props.view === 'net' ? styleFrame : { border: 'none' }}>
                    NET
                    <div id="full" style={{ backgroundImage: `linear-gradient(90deg, #2191A0 ${(this.props.resources.net_limit.used / this.props.resources.net_limit.max) * 100}%, rgba(33, 145, 160, 0.349) ${(this.props.resources.net_limit.used / this.props.resources.net_limit.max) * 100}%` }}>
                        {/* <div style={{backgroundColor: '#2191A0', width:`${(this.props.resources.net_limit.used/this.props.resources.net_limit.max)*300}px`}}>
                        </div> */}
                    </div>
                    {(this.props.resources.net_limit.used / 1000).toFixed(3)} Kb / {(this.props.resources.net_limit.max / 1000).toFixed(3)} Kb
                </div>
            </div>
        )
        //     // `linear-gradient(90deg, #6B76B4 ${(this.props.resources.cpu_limit.used/this.props.resources.cpu_limit.max)*100}%, #53586E ${(this.props.resources.cpu_limit.available/this.props.resources.cpu_limit.max)*100}%
    }
}

export default Visualizer