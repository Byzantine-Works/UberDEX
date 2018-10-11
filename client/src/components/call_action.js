import React, {Component} from 'react';

class Call_action extends Component{
    render(){
       
        return(
            <div className="call_action">
                <div className="call_inner">
                    <div className="container">
                        <form>
                            <input type="text" placeholder="Email Address" />
                            <input type="submit" value="Get Started" />
                        </form>
                        <h5>Ready to buy EOS?</h5>
                        <h5>Get started with $50 or less</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default Call_action;