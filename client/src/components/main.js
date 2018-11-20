import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import Header from './header';
import Home from './home';
import Exchange from './exchangePage';
import Market from './market';
import Support from './support';
import About from './about';
import Useragreement from './userAgreement';
import Contact from './contact';
import trade from './trade';
import traderule from './tradeRule';
import announcements from './announcements';
import failannouncement from './failAnnouncement';
import TransactionPage from './transactionPage';
import Account from './account';

class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {

        return (
        <Switch>
            <Route exact path='/' render={(props) => {return <Home updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}} />
            <Route path='/exchange' render={(props) => {return <Exchange scatterEOS={this.props.scatterEOS} updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}}/>
            <Route path='/market' component={(props) => {return <Market updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}} />
            <Route path='/support' component={(props) => {return <Support updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}} />
            <Route path='/about' component={ About } />
            <Route path='/user_agreement' component={ Useragreement } />
            <Route path='/contact' component={(props) => {return <Contact updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}} />
            <Route path='/trade' component={ trade } />
            <Route path='/trade_rule' component={ traderule } />
            <Route path='/announcements' component={ announcements } />
            <Route path='/failannouncement' component={ failannouncement } />
            <Route path='/transaction' component={ TransactionPage } />
            <Route path='/account' component={(props) => {return <Account scatterEOS={this.props.scatterEOS} updateScatterID={this.props.updateScatterID} scatterID={this.props.scatterID}/>}} />
        </Switch>

  
        )
    }
}


export default Main;