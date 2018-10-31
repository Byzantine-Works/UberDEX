'use strict';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const uberdexAPI = require('./uberdexapi.js'); // EOS Exchange Contract interface API

const EXCHANGE = "exchange"; //exchange account where eos contract is deployed
const LEDGER = "ledger"; //fee account where maker/taker fees are accrued
const EXCHANGE_ADMIN = "admin"; //admin account

const nonce = 42; //seed a random nonce
const invalidate_orders_before_nonce = 50;
console.log('mode', process.env.mode); //use modes to run tests on jungletestnet, idex testnet etc

//Maker1 Account/Trade Configuration
const MAKER1 = "maker1";
const MAKER1_TEST_DEPOSIT_AMOUNT = "100.0000 EOS";
const MAKER1_TEST_WITHDRAW_AMOUNT = "100.0000 EOS@eosio.token";
const MAKER1_TEST_DEPOSIT_TRADE_AMOUNT = "1000.0000 EOS";
const MAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS = "898.4000 EOS@eosio.token";
const MAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS = "100.0000 SYS@eosio.token";

//Taker1 Account/Trade Configuration
const TAKER1 = "taker1";
const TAKER1_TEST_DEPOSIT_AMOUNT = "100.0000 SYS";
const TAKER1_TEST_WITHDRAW_AMOUNT = "100.0000 SYS@eosio.token";
const TAKER1_TEST_DEPOSIT_TRADE_AMOUNT = "1000.0000 SYS";
const TAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS = "100.0000 EOS@eosio.token";
const TAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS = "897.4000 SYS@eosio.token";

// everipediaiq IQ contract test configuration for deposit and transfer
const MULTI_TOKEN_CONTRACT_DEPOSIT_TRADE_AMOUNT = "1.000 IQ";
const MULTI_TOKEN_CONTRACT_WITHDRAW_TRADE_AMOUNT = "1.000 IQ@everipediaiq";
const MULTI_TOKEN_CONTRACT_TEST_USER = "reddy";

// Escape hatch test configuration for exchange-signatureless withdrawals
const ESCAPE_HATCH_DEPOSIT_AMOUNT = "3.1234 EOS";
const ESCAPE_HATCH_WITHDRAW_AMOUNT = "1.1234 EOS@eosio.token";
const ESCAPE_HATCH_TEST_USER = "escapeuser";

// Lock/Unlock test configuration to allow for withdrawal after lock
const LOCK_WITHDRAW_AMOUNT = "1.0000 EOS@eosio.token";
const POST_UNLOCK_WITHDRAW_AMOUNT = "1.0000 EOS@eosio.token";

//Escape Hatch Trigger lock parameters
const FUNDS_RELEASE_PERIOD = 10;
const TRADE_LOCK_PERIOD = 1;

//ACCOUNT FEES
const MAKER_FEE = 160;
const TAKER_FEE = 260;

function log(string) {
    if (process.env.CHAI_VERBOSITY !== 'false') {
        console.log(string);
    }
}

function getAmountForSymbol(json, symbol) {
    var balArray = JSON.parse(json);
    for (var i = 0, len = balArray.length; i < len; i++) {
        if (balArray[i].token.indexOf(symbol) > -1) {
            //log("getAmountForSymbol=>" + symbol + " amount=>" + balArray[i].amount);
            return balArray[i].amount;
        }
    }
}

describe('IDEX EOS-ExchangeContract', function () {
    this.timeout(10000);
    before(function () {});
    after(function () {});


    // GET - Nodeos Info
    it('[1] should return matching node version => 4f4e5c22', function () {
        return chai.request(uberdexAPI)
            .get('/info')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.server_version).to.be.an('string');
                expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });


    // POST - Reset Exchange Accounts Action before running the test suite
    it('[2] should reset *all* exchange accounts', function () {
        return chai.request(uberdexAPI)
            .post('/reset')
            .send({
                owner: EXCHANGE
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST -  set admin Action for exchange contract with ADMIN account
    it('[3] should allow setting an exchange admin account', function () {
        return chai.request(uberdexAPI)
            .post('/setAdmin')
            .send({
                account: EXCHANGE_ADMIN,
                isAdmin: true
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Set Lock Parameters Action for triggering escape-hatch contract functionality
    // Starting with this out of sequence to have enough blocks lapsed to test userWithdraw action later
    it('[4] should allow exchange admin to set release period to trigger escape hatch with t=' + (1), function () {
        return chai.request(uberdexAPI)
            .post('/setLockParameters')
            .send({
                admin: EXCHANGE_ADMIN,
                tradelockperiod: TRADE_LOCK_PERIOD,
                fundsreleaseperiod: FUNDS_RELEASE_PERIOD
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // // TEST - Set Release Period Action for escape-hatch contract functionality
    // // Starting with this out of sequence to have enough blocks lapsed to test userWithdraw action later
    // it('[4] should allow exchange admin to set release period to trigger escape hatch with t=' + (1), function () {
    //     return chai.request(uberdexAPI)
    //         .post('/setReleasePeriod')
    //         .send({
    //             admin: EXCHANGE_ADMIN,
    //             period: 1
    //         })
    //         .then(function (res) {
    //             log(res.body);
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body.transaction_id).to.be.an('string');
    //             expect(res.body.processed.receipt.status).to.equal('executed');
    //         });
    // });


    // Out of sequence deposit action to test escape-hatch userWithdraw action
    // TEST - Deposit Action for testing escape-hatch contract functionality
    it('[5] should allow EOS token deposit for escape-hatch-test from *' + ESCAPE_HATCH_TEST_USER + '* for amount:' + ESCAPE_HATCH_DEPOSIT_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: ESCAPE_HATCH_TEST_USER,
                amount: ESCAPE_HATCH_DEPOSIT_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST -  lock user account with current block number
    it('[6] should allow user to lock his exchange account', function () {
        return chai.request(uberdexAPI)
            .post('/lock')
            .send({
                account: ESCAPE_HATCH_TEST_USER
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });

    // POST - Check Balance Action for fee-account-ledger LEDGER account
    it('[7] should have zero fee-account-ledger balance for symbol EOS', function () {
        return chai.request(uberdexAPI)
            .post('/accountBalance')
            .send({
                user: LEDGER,
                symbol: 'EOS'
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.instanceof(Array);
                expect(res.body).to.have.length.below(1);
            });
    });


    // POST - Check Balance Action for LEDGER account
    it('[8] should have zero fee-account-ledger balance for symbol SYS', function () {
        return chai.request(uberdexAPI)
            .post('/accountBalance')
            .send({
                user: LEDGER,
                symbol: 'SYS'
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.instanceof(Array);
                expect(res.body).to.have.length.below(1);
            });
    });


    // POST - Deposit Action for Maker1 account
    it('[9] should accept deposit from *' + MAKER1 + '* for amount:' + MAKER1_TEST_DEPOSIT_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: MAKER1,
                amount: MAKER1_TEST_DEPOSIT_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Check Balance Action for Maker1 account
    it('[10] should display exchange balances for *' + MAKER1 + '* for amount:' + MAKER1_TEST_DEPOSIT_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: MAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(MAKER1_TEST_DEPOSIT_AMOUNT.replace(/[^\d\.]*/g, '') * 10000);

                expect(balanceJson.token).to.equal("4,EOS@eosio.token");
                expect(balanceJson.account).to.equal(MAKER1);
            });
    });


    // POST - Withdraw Action for Maker1 account with admin signature
    it('[11] should withdraw exchange balance for *' + MAKER1 + '* for amount:' + MAKER1_TEST_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: MAKER1,
                amount: MAKER1_TEST_WITHDRAW_AMOUNT,
                nonce: nonce
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Check Balance Action for Maker1 account post Withdraw Action
    it('[12] should display 0 exchange balance for *' + MAKER1 + '* after withdrawal of amount:' + MAKER1_TEST_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: MAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(0);
                expect(balanceJson.token).to.equal("4,EOS@eosio.token");
                expect(balanceJson.account).to.equal(MAKER1);
            });
    });


    // POST - Deposit Action for Taker1 account
    it('[13] should accept deposit from *' + TAKER1 + '* for amount:' + TAKER1_TEST_DEPOSIT_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: TAKER1,
                amount: TAKER1_TEST_DEPOSIT_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Check Balance Action for Taker1 account
    it('[14] should display exchange balances for *' + TAKER1 + '* for amount:' + TAKER1_TEST_DEPOSIT_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: TAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(TAKER1_TEST_DEPOSIT_AMOUNT.replace(/[^\d\.]*/g, '') * 10000);
                expect(balanceJson.token).to.equal("4,SYS@eosio.token");
                expect(balanceJson.account).to.equal(TAKER1);
            });
    });


    // POST - Withdraw Action for Taker1 account with admin signature
    it('[15] should withdraw exchange balance for *' + TAKER1 + '* for amount:' + TAKER1_TEST_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: TAKER1,
                amount: TAKER1_TEST_WITHDRAW_AMOUNT,
                nonce: nonce
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Check Balance Action for Taker1 account post Withdraw Action
    it('[16] should display 0 exchange balance for *' + TAKER1 + '* after withdrawal of amount:' + TAKER1_TEST_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: TAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(0);
                expect(balanceJson.token).to.equal("4,SYS@eosio.token");
                expect(balanceJson.account).to.equal(TAKER1);
            });
    });


    // POST - Deposit Action for Trade @Maker1 account
    it('[17] should accept deposit from *' + MAKER1 + '* for amount:' + MAKER1_TEST_DEPOSIT_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: MAKER1,
                amount: MAKER1_TEST_DEPOSIT_TRADE_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Deposit Action for Trade @Taker1 account
    it('[18] should accept deposit from *' + TAKER1 + '* for amount:' + TAKER1_TEST_DEPOSIT_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: TAKER1,
                amount: TAKER1_TEST_DEPOSIT_TRADE_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Check Balance Action for Maker1 account prior to Trade
    it('[19] should display exchange balance for *' + MAKER1 + '* prior to trade for amount:' + MAKER1_TEST_DEPOSIT_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: MAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') * 10000);
                expect(balanceJson.token).to.equal("4,EOS@eosio.token");
                expect(balanceJson.account).to.equal(MAKER1);
            });
    });


    // POST - Check Balance Action for Taker1 account prior to Trade
    it('[20] should display exchange balances for *' + TAKER1 + '* prior to trade for amount:' + TAKER1_TEST_DEPOSIT_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: TAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceJson = JSON.parse((res.body.processed.action_traces[0].console).replace(/\'/g, "\""));
                expect(balanceJson.amount).to.equal(TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') * 10000);
                expect(balanceJson.token).to.equal("4,SYS@eosio.token");
                expect(balanceJson.account).to.equal(TAKER1);
            });
    });


    // POST - User Register public_key Action prior to Trading
    it('[21] should allow for registering *' + MAKER1 + '* accounts public_key', function () {
        return chai.request(uberdexAPI)
            .post('/register')
            .send({
                account: MAKER1,
                pubkey: process.env.USER_PUB_KEY
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - User Register public_key Action prior to Trading
    it('[22] should allow for registering *' + TAKER1 + '* accounts public_key', function () {
        return chai.request(uberdexAPI)
            .post('/register')
            .send({
                account: TAKER1,
                pubkey: process.env.USER_PUB_KEY //IDEX_USER_PUB_KEY
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Trade with maker=maker1 and taker=taker1 accounts for 100*10k SYS for 100*10k EOS
    //TODO: Figure what the amount attrib needed for contract is? esp when buy/sell already indicate the amount
    //TODO: Figure if order and trade nonce needs incrementing on account of uniqueness checks?
    it('[23] should enable execution of a trade match action with admin signature between *maker=' + MAKER1 + '* & *taker=' + TAKER1 + '* for maker amount:=>EOS:' + (((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10)) + ' & taker amount:=>SYS:' + (((TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10)), function () {
        // log({
        //     amountbuy: (((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
        //     amountsell: (((TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
        //     nonce: 1,
        //     amount: (((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
        //     tradenonce: 1,
        //     tokenbuy: TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^a-zA-Z]/g,''),
        //     tokensell: MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^a-zA-Z]/g,''),
        //     makerfee: MAKER_FEE,
        //     takerfee:TAKER_FEE,
        //     maker:MAKER1,
        //     taker: TAKER1,
        //     feeaccount:EXCHANGE
        // });
        return chai.request(uberdexAPI)
            .post('/trade')
            .send({
                admin: EXCHANGE_ADMIN,
                amountbuy: (((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
                amountsell: (((TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
                nonce: 1,
                amount: (((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '')) / 10) * 10000),
                tradenonce: 1,
                tokenbuy: TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^a-zA-Z]/g, ''),
                tokensell: MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^a-zA-Z]/g, ''),
                makerfee: MAKER_FEE,
                takerfee: TAKER_FEE,
                maker: MAKER1,
                taker: TAKER1,
                feeaccount: LEDGER
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Post Trade Action, Check Balance Action for Ledger Account
    it('[24] should validate MAKER_FEE and TAKER_FEE  on ledger account after trade Action for MAKER_FEE=>' + MAKER_FEE + ' & TAKER_FEE=>' + TAKER_FEE, function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: LEDGER
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceStr = (res.body.processed.action_traces[0].console).replace(/\'/g, "\"");
                var balanceJson = '[' + balanceStr.replace(/\}{/g, "\},{") + ']';
                var makerFee = getAmountForSymbol(balanceJson, "SYS");
                var takerFee = getAmountForSymbol(balanceJson, "EOS");
                log("makerFee:takerFee accrued on ledger account => EOS@" + makerFee / 10000 + ":SYS@" + takerFee / 10000);
                expect(makerFee).to.equal((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10 * 100) * (MAKER_FEE / 10000));
                expect(takerFee).to.equal((TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10 * 100) * (TAKER_FEE / 10000));
            });
    });


    // Post-Trade, Check Balance Action for Maker account
    it('[25] should validate Maker Balances & Token Symbols post Order match and Trade execution', function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: MAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceStr = (res.body.processed.action_traces[0].console).replace(/\'/g, "\"");
                var balanceJson = '[' + balanceStr.replace(/\}{/g, "\},{") + ']';
                var eos_tokens = getAmountForSymbol(balanceJson, "EOS");
                var sys_tokens = getAmountForSymbol(balanceJson, "SYS");
                log("Maker balances on exchange post-trade => EOS@" + eos_tokens / 10000 + ":SYS@" + sys_tokens / 10000);
                log("Maker Bal should be->SYS@" + (1000 - 100 - (MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10) * (MAKER_FEE / 10000)));
                log("Maker Bal should be->EOS@" + (MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10));
                // TODO: @reddy: derive the amount based on fee structure in lieu of hardcoded math
                expect(eos_tokens).to.equal(899.974 * 10000);
                // expect(eos_tokens / 10000).to.equal((1000 - 100 - (MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10) * (MAKER_FEE / 10000)));
                // expect(sys_tokens / 10000).to.equal((MAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10));
            });
    });


    // Post-Trade, Check Balance Action for Taker account
    it('[26] should validate Taker Balances & Token Symbols post Order match and Trade execution', function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: TAKER1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceStr = (res.body.processed.action_traces[0].console).replace(/\'/g, "\"");
                var balanceJson = '[' + balanceStr.replace(/\}{/g, "\},{") + ']';
                var eos_tokens = getAmountForSymbol(balanceJson, "EOS");
                var sys_tokens = getAmountForSymbol(balanceJson, "SYS");
                log("Taker balances on exchange post-trade => EOS@" + eos_tokens / 10000 + ":SYS@" + sys_tokens / 10000);
                log("Taker Bal should be->SYS@" + (1000 - 100 - (TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10) * (TAKER_FEE / 10000)));
                log("Taker Bal should be->EOS@" + (TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10));
                //expect(sys_tokens / 10000).to.equal((1000 - 100 - (TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10) * (TAKER_FEE / 10000)));
                //expect(eos_tokens / 10000).to.equal((TAKER1_TEST_DEPOSIT_TRADE_AMOUNT.replace(/[^\d\.]*/g, '') / 10));
                // TODO: @reddy: derive the amount based on fee structure in lieu of hardcoded math
                expect(sys_tokens).to.equal(899.984 * 10000);
            });
    });


    // POST - Withdraw Action for Maker1 account post-trade for symbol@EOS using admin signature
    it('[27] should enable withdrawing exchange balance post-trade for *' + MAKER1 + '* for amount:' + MAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS + " with nonce=" + (nonce + 1), function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: MAKER1,
                amount: MAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS,
                nonce: nonce + 1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Withdraw Action for Maker1 account post-trade for symbol@SYS with admin signature
    it('[28] should enable withdrawing exchange balance post-trade for *' + MAKER1 + '* for amount:' + MAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS + " with nonce=" + (nonce + 2), function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: MAKER1,
                amount: MAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS,
                nonce: nonce + 2
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Withdraw Action for Taker1 account post-trade for symbol@EOS with admin signature
    it('[29] should enable withdrawing exchange balance post-trade for *' + TAKER1 + '* for amount:' + TAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS + " with nonce=" + (nonce + 1), function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: TAKER1,
                amount: TAKER1_TEST_WITHDRAW_TRADE_BALANCE_EOS,
                nonce: nonce + 1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Withdraw Action for Taker1 account post-trade for symbol@SYS with admin signature
    it('[30] should enable withdrawing exchange balance post-trade for *' + MAKER1 + '* for amount:' + TAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS + " with nonce=" + (nonce + 2), function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: TAKER1,
                amount: TAKER1_TEST_WITHDRAW_TRADE_BALANCE_SYS,
                nonce: nonce + 2
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // POST - Balance validate Action for fee-account viz LEDGER post-trade for symbol@EOS and SYS
    it('[31 & 32] should validate feeAccount [LEDGER] balance post-trade for amount:0.016 EOS@eosio.token && 0.026 SYS@eosio.token', function () {
        return chai.request(uberdexAPI)
            .post('/balance')
            .send({
                user: LEDGER
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
                var balanceStr = (res.body.processed.action_traces[0].console).replace(/\'/g, "\"");
                var balanceJson = '[' + balanceStr.replace(/\}{/g, "\},{") + ']';
                var eos_tokens = getAmountForSymbol(balanceJson, "EOS");
                var sys_tokens = getAmountForSymbol(balanceJson, "SYS");
                log("LEDGER balances on exchange post-trade => EOS@" + eos_tokens / 10000 + ":SYS@" + sys_tokens / 10000);
                log("LEDGER Bal should be-> 0.026 SYS");
                log("LEDGER Bal should be->0.016 EOS");
                // TODO: @reddy: derive the amount based on fee structure in lieu of hardcoded math
                expect(eos_tokens / 10000).to.equal(0.026);
                expect(sys_tokens / 10000).to.equal(0.016);
            });
    });


    // TEST - Deposit Action using a non-eosio-token contract and symbol IQ @reddy account
    it('[33] should allow IQ token deposit using everipediaiq token contract from *' + MULTI_TOKEN_CONTRACT_TEST_USER + '* for amount:' + MULTI_TOKEN_CONTRACT_DEPOSIT_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/deposit')
            .send({
                account: MULTI_TOKEN_CONTRACT_TEST_USER,
                amount: MULTI_TOKEN_CONTRACT_DEPOSIT_TRADE_AMOUNT
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Withdraw Action using a non-eosio-token contract and symbol IQ @reddy account
    it('[34] should allow IQ token withdraw using everipediaiq token contract from *' + MULTI_TOKEN_CONTRACT_TEST_USER + '* for amount:' + MULTI_TOKEN_CONTRACT_WITHDRAW_TRADE_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdraw')
            .send({
                admin: EXCHANGE_ADMIN,
                account: MULTI_TOKEN_CONTRACT_TEST_USER,
                amount: MULTI_TOKEN_CONTRACT_WITHDRAW_TRADE_AMOUNT,
                nonce: nonce
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Withdrawal Action for testing escape-hatch contract functionality without admin or exchange account signatures
    it('[35] should allow EOS token withdrawal without admin/exchange signatures for escape-hatch-test from *' + ESCAPE_HATCH_TEST_USER + '* for amount:' + ESCAPE_HATCH_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdrawViaEscapeHatch')
            .send({
                account: ESCAPE_HATCH_TEST_USER,
                amount: ESCAPE_HATCH_WITHDRAW_AMOUNT,
                nonce: nonce + 1
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Invalidate Orders before Action for preventing compromised exchange trade actions with admin and user signatures
    it('[36] should allow order invalidations for nonce <= ' + invalidate_orders_before_nonce, function () {
        return chai.request(uberdexAPI)
            .post('/invalidateOrders')
            .send({
                admin: EXCHANGE_ADMIN,
                account: ESCAPE_HATCH_TEST_USER,
                nonce: invalidate_orders_before_nonce
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Withdrawal Action for testing user lock functionality - MUST FAIL
    it('[37] should allow token withdrawal when user_lock_period + inactivity time period is less than current block for *' + ESCAPE_HATCH_TEST_USER + '* for amount:' + LOCK_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdrawViaEscapeHatch')
            .send({
                account: ESCAPE_HATCH_TEST_USER,
                amount: LOCK_WITHDRAW_AMOUNT,
                nonce: nonce + 2
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });


    // TEST - Withdrawal Action for testing user lock functionality - MUST SUCCEED
    it('[38] should allow token withdrawal when user_lock_period + inactivity time period is less than current block for *' + ESCAPE_HATCH_TEST_USER + '* for amount:' + LOCK_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdrawViaEscapeHatch')
            .send({
                account: ESCAPE_HATCH_TEST_USER,
                amount: LOCK_WITHDRAW_AMOUNT,
                nonce: nonce + 3
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });

    // POST -  unlock user account
    it('[39] should allow user to unlock his exchange account', function () {
        return chai.request(uberdexAPI)
            .post('/unlock')
            .send({
                account: ESCAPE_HATCH_TEST_USER
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });

    // TEST - Withdrawal Action for withdraw post 'user unlock' functionality - MUST SUCCEED
    it('[40] should not allow token withdrawal via escape hatch route after user has unlocked account for *' + ESCAPE_HATCH_TEST_USER + '* for amount:' + POST_UNLOCK_WITHDRAW_AMOUNT, function () {
        return chai.request(uberdexAPI)
            .post('/withdrawViaEscapeHatch')
            .send({
                account: ESCAPE_HATCH_TEST_USER,
                amount: POST_UNLOCK_WITHDRAW_AMOUNT,
                nonce: nonce + 4
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(400);
            });
    });


    // POST - Reset Exchange Accounts Action after running the test suite
    it('[41] should reset *all* exchange accounts', function () {
        return chai.request(uberdexAPI)
            .post('/reset')
            .send({
                owner: EXCHANGE
            })
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.transaction_id).to.be.an('string');
                expect(res.body.processed.receipt.status).to.equal('executed');
            });
    });
    //TODO: @reddy add testcases for replay order trades post invalidation for the user @test#34
    //TODO: @reddy add testcases for corrolaries to #lock/unlock variations


    //UberDEX API Testcases
    // GET - UberDEX Traded Symbols
    it('[41] should return EOS Derivative Token + Symbols', function () {
        return chai.request(uberdexAPI)
            .get('/symbols')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });

    // GET - UberDEX Traded Symbols
    it('[42] should return EOS Derivative Token Symbol Ticker', function () {
        return chai.request(uberdexAPI)
            .get('/ticker')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });

    // GET - UberDEX Symbol specific ticker
    it('[43] should return Ticker data for a specific symbol => IQ', function () {
        return chai.request(uberdexAPI)
            .get('/tickerBySymbol')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });

    // GET - UberDEX Specific Buy Side orders for depth =10
    it('[44] should return BUY side Order data for a specific symbol => IQ and depth=10', function () {
        return chai.request(uberdexAPI)
            .get('/orderBySymbolBuySide')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });

    // GET - UberDEX Specific Buy Side orders for depth =10
    it('[45] should return SELL side Order data for a specific symbol => IQ and depth=10', function () {
        return chai.request(uberdexAPI)
            .get('/orderBySymbolSellSide')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });

    // GET - UberDEX IQ Symbol Specific orderbook for depth =10
    it('[46] should return LDAR Order book by specific symbol => IQ and depth=10', function () {
        return chai.request(uberdexAPI)
            .get('/orderbook')
            .then(function (res) {
                log(res.body);
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                // expect(res.body.server_version).to.be.an('string');
                //expect(res.body.server_version).to.equal('4f4e5c22');
            });
    });
});