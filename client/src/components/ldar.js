import React, {Component} from 'react';
import $ from "jquery";
import dp from '../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];

function handledefualt(e)
{
   if($('body').hasClass('lightVersion'))
    {
      $('.darkt').css('display', 'inline-block');
$('.lightT').css('display', 'none');
    }
    else
    {
      $('.darkt').css('display', 'none');
$('.lightT').css('display', 'inline-block');
    }
}
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
      //  console.log(search);
       
           $('table tbody tr td:nth-child(2)').each(function(i,v){
           //console.log(search+" "+$(this).html().toLowerCase().indexOf(search));
       if($(this).html().toLowerCase().indexOf(search)>=0)
       {
        //console.log('find');
        $('table tbody tr').eq(i).show();
       }
       else
       {
        //console.log('not');
         $('table tbody tr').eq(i).hide();
       }
    });
       }
      
    //   console.log( $('.table tbody tr').html());
 
      }
class Home extends Component{
    constructor(props) {
    super(props);

    this.state = {
        colors: [],
        logo: [],
        hits: [],
        hitss: [],
    };
  }

componentDidMount() {
    var url = new URL(window.location.href);
    var c = url.searchParams.get("opt");
    var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
    fetch(API)
    .then(response => response.json())
    .then(data => {this.setState({ hits: data }); });
    
    var APIs = 'https://api.byzanti.ne/exchanges?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
    fetch(APIs)
    .then(response => response.json())
    .then(data => {this.setState({ hitss: data }); });

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
    setTimeout(function(){
        handledefualt();
           
    },3000);
}
render(){
    const { hits } = this.state;
    const { hitss } = this.state;
        return(
            <div className="HomePage" >
                
                {hits.map(hit =>
                    <div className="ldrHeader">
                        <div className="container clearfix">
                            <div className="innerLdrheader clearfix">
                                <div className="coinName">
                                    <h2>{hit.symbol} /<small>EOS</small></h2>
                                </div>
                                <div className="coinDetail">
                                    <h3>{hit.volume} <small>{hit.symbol}</small></h3>
                                    <p>= Last Price {hit.last} EOS | 24H Change {hit.change} EOS | 24H Change {hit.high} EOS | 24H Low {hit.high} EOS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                
                <div className="LdrChart">
                    <div className="container">
                        <div id="lineChart4" style={{"height":"400px"}}></div>
                    </div>
                </div>
                
                <div className="searchHedear">
                    <div className="container">
                        <div className="searchInnerH">
                            <form>
                                <i className="fa fa-search"></i>
                                <input type="text" placeholder="Search" id="searchMarket" onChange={searchMarket}/>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="filterNexchage">
                    <div className="container">
                        <div className="innnerExchange clearfix">
                            <div className="filters">
                                <h3>Filter</h3>
                                <form>
                                    <label>Price Range</label>
                                    <input type="text" placeholder="Min" /> -
                                    <input type="text" placeholder="Max" /> 
                                    <label>Tick Size Range</label>
                                    <input type="text" placeholder="Min" /> -
                                    <input type="text" placeholder="Max" /> 
                                    <label>Volume Range</label>
                                    <input type="text" placeholder="Min" /> -
                                    <input type="text" placeholder="Max" /> 
                                </form>
                            </div>
                            <div className="exchange">
                                <table>
                                    <thead>
                                        <tr>
                                            <th><a href="/"><i className="fa fa-mins"></i></a></th>
                                            <th>Exchange</th>
                                            <th>Ticker Price</th>
                                            <th>Tick Size</th>
                                            <th>Total Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hitss.map(hit =>
                                            <tr>
                                                <td><label><input type="checkbox" /> <span><i className="fa fa-check" ></i></span></label></td>
                                                <td>{hit.name}</td> 
                                                <td>0.0672</td>
                                                <td>0.0020</td>
                                                <td>201,852.1298</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;