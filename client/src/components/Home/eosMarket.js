import React, {Component} from 'react';
import $ from "jquery";

import data from '../../app.json';
var color = {background: data['theme_color']};
var colors = {color: data['theme_color']};

const API = 'https://api.byzanti.ne/ticker?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';

class EOS extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
        };
      }
      componentDidMount() {
        fetch(API)
          .then(response => response.json())
          .then(data => this.setState({ tricker: data }));
      }
    render(){
        const { tricker } = this.state;
        return(
            <div className="EOStable">
                <div className="container">
                    <div className="tableTop clearfix">
                        <form>
                            <i className="fa fa-search"></i>
                            <input type="text" placeholder="Search" />
                        </form>
                        <p><i className="fa fa-star"></i> Favorites</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Pairs</th>
                                <th>Last Price</th>
                                <th>24h Change <span><i className="fa fa-angle-up"></i><i className="fa fa-angle-down"></i></span></th>
                                <th>24h High</th>
                                <th>24h Low</th>
                                <th>24h Volume <span><i className="fa fa-angle-up"></i><i className="fa fa-angle-down"></i></span></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            
                            
                        {tricker.map(hit =>{
                              var apiCall='https://min-api.cryptocompare.com/data/price?fsym='+hit.symbol+'&tsyms=USD';
                         
                        fetch(apiCall)
                            .then(response => response.json())
                            .then(data => {if(data.USD){
                               
                            }else
                            {
                                $('#'+hit.symbol).hide();
                            }});
                            
                        
                              return  <tr id={hit.symbol}>
                                    <td><i className="fa fa-star"></i></td>
                                    <td><a href={'/exchange/?opt='+hit.symbol}>{hit.symbol} / EOS</a></td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.last}</td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.change}</td>
                                    <td>{hit.high}</td>
                                    <td>{hit.low}</td>
                                    <td>{hit.volume}</td>
                                    <td><a href={'/exchange/?opt='+hit.symbol} className="trade colors" style={colors}>Trade</a></td>
                                </tr>
                                })}
                                
                        </tbody>
                    </table>

                    <div className="clearfix">
                        <a href="#" className="background" style={color}>View More</a>
                    </div>

                </div>
            </div>
        )
    }
}

export default EOS;