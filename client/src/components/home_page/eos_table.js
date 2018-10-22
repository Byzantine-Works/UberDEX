import React, {Component} from 'react';

const API = 'http://api.byzanti.ne:8902/ticker?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';

class Home_banner extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          hits: [],
        };
      }
      componentDidMount() {
        fetch(API)
          .then(response => response.json())
          .then(data => this.setState({ hits: data }));
      }
    render(){
        const { hits } = this.state;
        return(
            <div className="EOS_table">
                <div className="container">
                    <div className="table_top clearfix">
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
                            </tr>
                        </thead>
                        <tbody>
                            
                            
                            
                        {hits.map(hit =>
                                <tr>
                                    <td><i className="fa fa-star"></i></td>
                                    <td><a href={'/exchange/?opt='+hit.symbol}>{hit.symbol} / EOS</a></td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.last}</td>
                                    <td className={hit.change < 0?'minus':'plus'}>{hit.change}</td>
                                    <td>{hit.high}</td>
                                    <td>{hit.low}</td>
                                    <td>{hit.volume}</td>
                                </tr>
                                )}
                                
                        </tbody>
                    </table>

                    <div className="clearfix">
                        <a href="#">View More</a>
                    </div>

                </div>
            </div>
        )
    }
}

export default Home_banner;