import React, { Component } from 'react';
import Main from './components/main';
import Header from './components/header';
import Footer from './components/footer';
import data from './app.json';

import './App.css';

import { Layout, Content } from 'react-mdl';
var color = {background: data['theme_color']};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [],
      scatterID: false
    }
    this.updateScatterID = this.updateScatterID.bind(this);
  }

  updateScatterID(id) {
    this.setState({scatterID: id});
    }

  
  render() {
    return (
      <div className="demo-big-content">
          <Layout>
              <Content>
                  <div className="page-content" />
                    <div className="wellcomBanner background" style={{'background': this.state.colors}}>
                      <Header updateScatterID={this.updateScatterID} scatterID={this.state.scatterID} />
                    </div>
                  <Main />
                  <Footer updateScatterID={this.updateScatterID} scatterID={this.state.scatterID}/>
              </Content>
          </Layout>
      </div>
    );
  }
}

export default App;

