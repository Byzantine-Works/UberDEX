import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import $ from "jquery";
import { Link } from 'react-router-dom';

import dp from '../../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

const API = 'https://api.byzanti.ne/ticker?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
 function searchMarket(e)
      { 
        e.preventDefault();
       var search=e.target.value;
       search= search.toLowerCase();
       if(search.length<2)
       {
          $('table tbody tr td:nth-child(2)').each(function(i,v){
      $('table tbody tr').eq(i).show();
    });
     
       }
       else
       {
           $('table tbody tr td:nth-child(2)').each(function(i,v){
       if($(this).html().toLowerCase().indexOf(search)>0)
       {
        $('table tbody tr').eq(i).show();
       }
       else
       {
         $('table tbody tr').eq(i).hide();
       }
    });
       }
      
    //   console.log( $('.table tbody tr').html());
 
      }
class EOS extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
          colors: [],
          logo: [],
        };
      }
      componentDidMount() {
        fetch(API)
          .then(response => response.json())
          .then(data => this.setState({ tricker: data }));

          fetch(adminURL+'/getColors/'+apiId)
            .then(response => response.json())
            .then(data => {if(data.theme_color=='')
            {
                this.setState({colors:'#0e9caf'});
            }
            else
            {
                this.setState({colors:data.theme_color}); 
                this.setState({logo:adminURL+'/images/byzantine/'+data.logo});
            }
            }).catch(data => {
                this.setState({colors:'#0e9caf'});
            });
        }
    render(){
        const { tricker } = this.state;
        return(
            <div className="EOStable">
                <div className="container">
                    <div className="tableTop clearfix">
                        <form>
                            <i className="fa fa-search"></i>
                                 <input type="text" placeholder="Search" id="searchMarket" onChange={searchMarket} />
                       
                        </form>
                        <p style={{'color': this.state.colors, 'border-color':this.state.colors}}><i className="fa fa-star"></i> Favorites</p>
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
                                    <td><Link to={'/exchange/?opt='+hit.symbol} className="link">{hit.symbol} / EOS</Link></td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.last}</td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.change}</td>
                                    <td>{hit.high}</td>
                                    <td>{hit.low}</td>
                                    <td>{hit.volume}</td>
                                    <td><Link to={'/exchange/?opt='+hit.symbol} className="link tadeLink trade colors" style={{'color': this.state.colors}}>Trade</Link> </td>
                                    <td><Link to={'/ldar/?opt='+hit.symbol} className="link tadeLink trade colors" style={{'color': this.state.colors}}>LDAR</Link> </td>
                                </tr>
                                })}
                                
                        </tbody>
                    </table>

                    <div className="clearfix">
                        <a href="#" className="background"  style={{'background': this.state.colors}}>View More</a>
                    </div>

                </div>
            </div>
        )
    }
}

export default EOS;