import React from 'react';
import {Switch, Route} from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import Home from './home';
import Exchange from './exchange_page';
import Market from './market';
import Support from './support';
import About from './about';
import User_agreement from './user_agreement';
import contact from './contact';
import trade from './trade';
import trade_rule from './trade_rule';
import announcements from './announcements';
import fail_announcement from './fail_announcement';

const Main = ()=> (
    <BrowserRouter>
<Switch>
    <Route exact path='/' component={ Home } />
    <Route path='/exchange' component={ Exchange } />
    <Route path='/market' component={ Market } />
    <Route path='/support' component={ Support } />
    <Route path='/about' component={ About } />
    <Route path='/user_agreement' component={ User_agreement } />
    <Route path='/contact' component={ contact } />
    <Route path='/trade' component={ trade } />
    <Route path='/trade_rule' component={ trade_rule } />
    <Route path='/announcements' component={ announcements } />
    <Route path='/fail_announcement' component={ fail_announcement } />
</Switch>
</BrowserRouter>

);

export default Main;