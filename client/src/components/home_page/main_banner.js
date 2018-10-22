import React, {Component} from 'react';

class Home_banner extends Component{
    render(){
       
        return(
            <div className="main_banner">
                <div className="container">
                    <h1>The First EOS based decentralized exchange in the world</h1>
                    <p>No deposit / No withdrawal / Safe assets/ Open and transparency</p>
                    <form>
                        <div className="pms_field">
                            <input type="text" placeholder="" />
                            <label>Email Address</label>
                        </div>
                        <input type="submit" value="Sign Up" />
                        <a href="#">Join our Telegram</a>
                    </form>
                </div>
            </div>
        )
    }
}

export default Home_banner;