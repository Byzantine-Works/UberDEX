import React, { Component } from "react";
import scatter from "./imgs/scatter.PNG";
import logo_blue from "./imgs/logo_blue.png";
import $ from "jquery";

import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Eos from "eosjs";

ScatterJS.plugins(new ScatterEOS());

const network = {
  blockchain: "eos",
  protocol: "https",
  host: "http://54.183.9.138:8888",
  port: 8888,
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  debug: false,
  verbose: false,
  latency: 200
};

function handleClickss(e) {
  e.preventDefault();
  ScatterJS.scatter.connect("My-App").then(connected => {
    // If the user does not have Scatter or it is Locked or Closed this will return false;
    if (!connected) return false;

    const scatter = ScatterJS.scatter;

    // Now we need to get an identity from the user.
    // We're also going to require an account that is connected to the network we're using.
    const requiredFields = { accounts: [network] };
    scatter
      .getIdentity(requiredFields)
      .then(() => {
        // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
        // the user for their account name beforehand. They could still give you a different account.
        const account = scatter.identity.accounts.find(
          x => x.blockchain === "eos"
        );

        // You can pass in any additional options you want into the eosjs reference.
        const eosOptions = { expireInSeconds: 60 };

        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        const eos = scatter.eos(network, Eos, eosOptions);

        // ----------------------------
        // Now that we have an identity,
        // an EOSIO account, and a reference
        // to an eosjs object we can send a transaction.
        // ----------------------------

        // Never assume the account's permission/authority. Always take it from the returned account.
        const transactionOptions = {
          authorization: [`${account.name}@${account.authority}`]
        };

        eos
          .transfer(
            account.name,
            "helloworld",
            "1.0000 EOS",
            "memo",
            transactionOptions
          )
          .then(trx => {
            // That's it!
            console.log(`Transaction ID: ${trx.transaction_id}`);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        // The user rejected this request, or doesn't have the appropriate requirements.
        console.error(error);
      });
  });
}
function handleClicks(e) {
  e.preventDefault();
  $(".signIn_popup ").fadeOut();
}

class Footer extends Component {
  render() {
    return (
      <div>
        <div className="footer">
          <div className="container clearfix">
            <div className="widget">
              <img src={logo_blue} />
              <p>
                Cryptocurrency investment is subject to high market risk, please
                make your investments cautiously.
              </p>
              <span>Copyright 2018 UberDex Inc. All Right Reserved.</span>
            </div>

            <div className="widget">
              <h5>Products</h5>
              <ul>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
                <li>
                  <a href="/">Lorem Ipsum</a>
                </li>
              </ul>
            </div>

            <div className="widget">
              <h5>Learn</h5>
              <ul>
                <li>
                  <a href="/trade">How to Trade</a>
                </li>
                <li>
                  <a href="/trade_rule">Trading rule</a>
                </li>
                <li>
                  <a href="/announcements">Announcements</a>
                </li>
                <li>
                  <a href="/fail_announcement">Failed Announcements</a>
                </li>
              </ul>
            </div>

            <div className="widget">
              <h5>Company</h5>
              <ul>
                <li>
                  <a href="/about">About </a>
                </li>
                <li>
                  <a href="/user_agreement">User Agreement</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/support">Support</a>
                </li>
              </ul>
            </div>

            <div className="widget">
              <h5>Social</h5>
              <ul>
                <li>
                  <a href="/">Blog </a>
                </li>
                <li>
                  <a href="/">Twitter</a>
                </li>
                <li>
                  <a href="/">Facebook</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="signIn_popup">
          <div className="inners">
            <a href="#" className="cls" onClick={handleClicks}>
              <i className="fa fa-times" />
            </a>
            <img src={scatter} />
            <a href="#" className="sgn" onClick={handleClickss}>
              Sign in via Scatter
            </a>
            <p>Scatter allows convenient transactions without password</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
