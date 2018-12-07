import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import $ from "jquery";

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
          $('table tbody tr td:nth-child(1)').each(function(i,v){
      $('table tbody tr').eq(i).show();
    });
    $('.rhide').css('display','none');
     
       }
       else
       {
           $('table tbody tr td:nth-child(1)').each(function(i,v){
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
class Home_banner extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
          colors: [],
          logo: [],
            allSymbols:[],
          allSymbols2:[]
        };
          this.changeUp= this.changeUp.bind(this);
        this.changeDown= this.changeDown.bind(this);
         this.volumeUp= this.volumeUp.bind(this);
        this.volumeDown= this.volumeDown.bind(this);
      }
        changeDown=(e)=>{
         this.setState({tricker:this.state.tricker.sort((a, b) => b.change - a.change)});
      
      }
       changeUp=(e)=>{
       this.setState({tricker:this.state.tricker.sort((a, b) => a.change - b.change)});
       // this.state.tricker.sort((a, b) => a.change + b.change);
      }
       volumeDown=(e)=>{
         this.setState({tricker:this.state.tricker.sort((a, b) => b.volume - a.volume)});
      
      }
       volumeUp=(e)=>{
       this.setState({tricker:this.state.tricker.sort((a, b) => a.volume - b.volume)});
       // this.state.tricker.sort((a, b) => a.change + b.change);
      }
    async  componentDidMount() {
      await  fetch(API)
          .then(response => response.json())
          .then(data => this.setState({ tricker: data }));
           let allSymbol="";
          let allSymbol2="";
          this.state.tricker.forEach(function(hit){
                 if(allSymbol.length>=200)
                {
                     allSymbol2 +=hit.symbol+",";
                }
                else
                {
                    allSymbol +=hit.symbol+",";
               
                }
                });
              
        var apiCall='https://min-api.cryptocompare.com/data/pricemulti?fsyms='+allSymbol+'&tsyms=USD';
              
             await        fetch(apiCall)
                            .then(response => response.json())
                            .then(data => {
                                this.setState({allSymbols:data});
                            });
               var apiCall2='https://min-api.cryptocompare.com/data/pricemulti?fsyms='+allSymbol2+'&tsyms=USD';
              
                   await    fetch(apiCall2)
                            .then(response => response.json())
                            .then(data => {
                               this.setState({allSymbols2:data});
                            });
                            
          fetch(adminURL+'/getColors/'+apiId)
            .then(response => response.json())
            .then(data => {if(data.theme_color==='')
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
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th><input type="text" placeholder="Pair" id="searchMarket" onChange={searchMarket} /></th>
                                <th>Last Price</th>
                                 <th>24h Change <span><i className="fa fa-angle-up" onClick={this.changeUp}></i><i className="fa fa-angle-down" onClick={this.changeDown}></i></span></th>
                                <th>24h High</th>
                                <th>24h Low</th>
                            <th>24h Volume <span><i className="fa fa-angle-up" onClick={this.volumeUp}></i><i className="fa fa-angle-down" onClick={this.volumeDown}></i></span></th>
                                 </tr>
                        </thead>
                        <tbody>
                            {tricker.map((hit, i) =>{
                            return <tr id={hit.symbol} key={i}>
                                   <td><Link to={'/exchange/?opt='+hit.symbol+'&contract='+hit.contract} className="link">{hit.symbol} / EOS</Link></td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.last}</td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.change}</td>
                                    <td>{hit.high}</td>
                                    <td>{hit.low}</td>
                                    <td>{hit.volume}</td>
                                </tr>;  })}
                        </tbody>
                    </table>
                    <div className="clearfix">
                        <a href="/" className="background" style={{'background': this.state.colors}}>View More</a>
                    </div>

                </div>
            </div>
        )
    }
}

export default Home_banner;