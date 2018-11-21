require("dotenv").config();
const config = require("./config");
const ecc = require("eosjs-ecc");
const eosapiram = require("commander");
const BN = require("bignumber.js");
const Eos = require("eosjs");
const assert = require('assert');
const exchangeABI = require("./exchangeABI");


//Express related
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
module.exports = app;

//API related
//use mode to set 'local' or 'jungle' for the eos-chain network
//see config.js for configuration attributes
//see .env for various keys needed for signing transactions
var mode = process.env.MODE;

//mode = 'byzantinetestnet';
//mode = 'localtestnet';

var eosNetwork;

var MAKER_PRIV_KEY; //Priv key from .env for Maker actor
var TAKER_PRIV_KEY; //Priv key from .env for Taker actor
//Account defs
var EXCHANGE_ACCOUNT;
var FEE_ACCOUNT;
var MAKER_ACCOUNT;
var TAKER_ACCOUNT;
var eosTokenContract = "eosio.token";
var eosExchangeContract = "exchange";

if (mode == undefined || mode == 'byzantinetestnet') {
    // eosNetwork = config.byzantinetestnet;
    eosNetwork = config.localtestnet;
    eosNetwork.keyProvider = [process.env.OWNER_KEY, process.env.ACTIVE_KEY, process.env.MAKER_KEY, process.env.TAKER_KEY, process.env.LEDGER_KEY, process.env.REDDY_KEY, process.env.ESCAPEUSER_KEY, process.env.ADMIN_KEY];
    MAKER_PRIV_KEY = process.env.MAKER_KEY;
    TAKER_PRIV_KEY = process.env.TAKER_KEY;
    LEDGER_PRIV_KEY = process.env.LEDGER_KEY;
    REDDY_PRIV_KEY = process.env.REDDY_KEY;
    ESCAPEUSER_PRIV_KEY = process.env.ESCAPEUSER_KEY;
    ADMIN_PRIV_KEY = process.env.ADMIN_KEY;
    //Local Testnet Account defs
    EXCHANGE_ACCOUNT = config.byzantinetestnetaccount.EXCHANGE_ACCOUNT;
    EXCHANGE_ADMIN_ACCOUNT = config.byzantinetestnetaccount.ADMIN_ACCOUNT;
    ADMIN_ACCOUNT = config.byzantinetestnetaccount.ADMIN_ACCOUNT;
    LEDGER_ACCOUNT = config.byzantinetestnetaccount.LEDGER_ACCOUNT;
    MAKER_ACCOUNT = config.byzantinetestnetaccount.MAKER_ACCOUNT;
    TAKER_ACCOUNT = config.byzantinetestnetaccount.TAKER_ACCOUNT;
    eosTokenContract = config.byzantinetestnetaccount.eosTokenContract;
    eosExchangeContract = config.byzantinetestnetaccount.eosExchangeContract;
}

const chainId = config.localtestnet.chainId;
const httpEndpoint = config.localtestnet.httpEndpoint;
const exchangeAccount = "exchange";
const exchangeAdminAccount = "admin";

eos = Eos(eosNetwork);
const uint64_size = 8;

var {
    format
} = Eos.modules;

async function resetExchange(args) {
    if (args.length < 1) {
        log(`Usage:eosapi resetExchange owner. Example 'eosapi resetExchange owner`);
        return;
    }
    [owner] = args;
    var trxResetExchange = await eos.transaction('exchange', (contractuser) => {
        contractuser.resetex({
            owner: owner
        }, {
            authorization: [owner]
        });
    });
    return trxResetExchange;
}

async function invalidateOrders(args) {
    if (args.length < 3) {
        log(`Usage:eosapi invalidateorders admin account nonce. Example 'eosapi invalidateOrder admin 42`);
        return;
    }
    [admin, account, nonce] = args;
    log('function:invalidateOrders :: admin:account:nonce => ' + admin + ':' + account + ':' + nonce);
    var trxInvalidateOrders = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.invalorders({
            admin: admin,
            user: account,
            nonce: nonce
        }, {
            authorization: [EXCHANGE_ADMIN_ACCOUNT]
        });
    });
    //log(trxInvalidateOrders);
    return trxInvalidateOrders;
}

async function getAccount(args) {
    if (args.length < 1) {
        log(`Usage:eosapi getAccount account. Example 'eosapi getAccount user1`);
        return;
    }
    [user] = args;
    const accountInfo = await eos.getAccount(user);
    log("getAccount for user '" + user + "' is ", accountInfo);
    return accountInfo;
}

async function getBalance(args) {
    if (args.length < 2) {
        log(`Usage:eosapi balance account symbol. Example 'eosapi balance user1 SYS`);
        return;
    }
    [user, symbol] = args;
    const balance = await eos.getCurrencyBalance('eosio.token', user, symbol);
    log("balance for account/user '" + user + "' is ", balance);
    return balance;
}

async function getExBalance(args) {
    if (args.length < 1) {
        log(`Usage:eosapi exbalance account. Example 'eosapi exbalance user1`);
        return;
    }
    [account] = args;
    log('getExBalance => for account:' + account);
    var trxGetExBalance = await eos.transaction('exchange', (contractuser) => {
        contractuser.getbalances({
            owner: account
        }, {
            authorization: [account]
        });
    });
    //log("method:getExBalance -> \n");
    //log(trxGetExBalance);
    return trxGetExBalance;
}
/*
const options = {
  authorization: ["reddy@active", "exchange@active"],
  broadcast: true,
  sign: true
};*/

//Deposit with exchange contract
async function deposit(args) {
    if (args.length < 2) {
        log(`Usage:eosapi  deposit account amount. Example 'eosapi deposit user1 "1.0000 SYS"`);
        return;
    }

    [account, amount] = args;
    log('function:deposit :: account=' + account + ' amount= ' + amount);
    if (amount.indexOf('IQ') > -1) {
        eosTokenContract = 'everipediaiq';
    }
    var trxDeposit = await eos.transaction(eosTokenContract, (contractuser) => {
        contractuser.transfer({
            from: account,
            to: EXCHANGE_ACCOUNT,
            quantity: amount,
            memo: 'deposit'
        }, {
            authorization: [account]
            //authorization:[{ actor: account, permission:'active' }]
        });
    });
    //log(trxDeposit);
    return trxDeposit;
}

async function setLockParameters(args) {
    if (args.length < 3) {
        log(`Usage:eosapi setLockParameters admin tradelockperiod fundsreleaseperiod. Example 'eosapi admin 1 100`);
        return;
    }
    [admin, tradelockperiod, fundsreleaseperiod] = args;
    log(
        'function:setLockParameters :: admin:tradelockperiod:fundsreleaseperiod=' +
        admin +
        ':' +
        tradelockperiod +
        ':' +
        fundsreleaseperiod
    );
    var trxSetLockParameters = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.setlockparam({
            admin: admin,
            tradelockperiod: tradelockperiod,
            fundsreleaseperiod: fundsreleaseperiod
        }, {
            authorization: [EXCHANGE_ADMIN_ACCOUNT]
        });
    });
    //log(trxSetLockParameters);
    return trxSetLockParameters;
}

async function setReleasePeriod(args) {
    if (args.length < 2) {
        log(`Usage:eosapi setReleasePeriod admin period. Example 'eosapi admin setreleaseperiod 1`);
        return;
    }
    [admin, period] = args;
    log('function:setReleasePeriod :: admin:period=' + admin + ':' + period);
    var trxSetReleasePeriod = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.setrelprd({
            admin: admin,
            releaseperiod: period
        }, {
            authorization: [EXCHANGE_ADMIN_ACCOUNT]
        });
    });
    //log(trxSetReleasePeriod);
    return trxSetReleasePeriod;
}

async function setadmin(args) {
    if (args.length < 2) {
        log(`Usage:eosapi setadmin account isadmin. Example 'eosapi setadmin admin true`);
        return;
    }
    [account, isAdmin] = args;
    log('function:setadmin :: account:isAdmin=' + account + ':' + isAdmin);
    var trxSetAdmin = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.setadmin({
            account: account,
            isadmin: isAdmin ? 1 : 0
        }, {
            authorization: [EXCHANGE_ACCOUNT]
        });
    });
    //log(trxSetAdmin);
    return trxSetAdmin;
}

async function lock(args) {
    if (args.length < 1) {
        log(`Usage:eosapi lock account. Example 'eosapi lock user`);
        return;
    }
    [account] = args;
    log('function:lock :: account=' + account);
    var trxLock = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.lock({
            user: account
        }, {
            authorization: [account]
        });
    });
    //log(trxLock);
    return trxLock;
}

async function unlock(args) {
    if (args.length < 1) {
        log(`Usage:eosapi unlock account. Example 'eosapi unlock user`);
        return;
    }
    [account] = args;
    log('function:unlock :: account=' + account);
    var trxUnlock = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.unlock({
            user: account
        }, {
            authorization: [account]
        });
    });
    //log(trxUnlock);
    return trxUnlock;
}

async function withdraw(args) {
    if (args.length < 3) {
        log(`Usage:eosapi withdraw account amount nonce. Example 'eosapi withdraw user1 "1.0000 SYS@eosio.token" 42`);
        return;
    }
    [admin, account, amount, nonce] = args;
    log('function:withdraw :: account=' + account + ' amount= ' + amount + ' :from:' + account + ' :nonce:' + nonce);
    // if (amount.indexOf("IQ") > -1) {
    //     eosTokenContract = "everipediaiq";
    // }else{
    //     eosTokenContract = "eosio.token";
    // }
    var trxWithdraw = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.withdraw({
            admin: admin,
            from: account,
            quantity: amount,
            nonce: nonce
        }, {
            authorization: [account, EXCHANGE_ADMIN_ACCOUNT]
        });
    });
    //log(trxWithdraw);
    return trxWithdraw;
}

async function withdraweh(args) {
    if (args.length < 3) {
        log(
            `Usage:eosapi withdraweh account amount nonce. Example 'eosapi withdraweh user1 "1.0000 SYS@eosio.token" 42`
        );
        return;
    }
    [account, amount, nonce] = args;
    log('function:withdraweh :: account=' + account + ' amount= ' + amount + ' :from:' + account + ' :nonce:' + nonce);
    // if (amount.indexOf("IQ") > -1) {
    //     eosTokenContract = "everipediaiq";
    // }else{
    //     eosTokenContract = "eosio.token";
    // }
    var trxWithdraw = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.userwithdraw({
            user: account,
            quantity: amount,
            nonce: nonce
        }, {
            authorization: [account]
        });
    });
    //log(trxWithdraw);
    return trxWithdraw;
}

async function withdrawadmin(args) {
    if (args.length < 2) {
        log(`Usage:eosapi withdrawadmin account amount. Example 'eosapi withdrawadmin ledger "1.0000 SYS@eosio.token"`);
        return;
    }
    [account, amount] = args;
    log('function:withdrawadmin :: account=' + account + ' amount= ' + amount + ' :from:' + EXCHANGE_ACCOUNT);

    var trxWithdraw = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.admwithdraw({
            ledger: account,
            quantity: amount
        }, {
            authorization: [account, EXCHANGE_ACCOUNT]
        });
    });
    //log(trxWithdraw);
    return trxWithdraw;
}

async function sign(args) {
    if (args.length < 2) {
        log(`Usage:eosapi sign data privateKey. Example 'eosapi sign some_data SOME_PRIV_KEY`);
        return;
    }
    [data, privateKey] = args;
    var signature = ecc.sign(data, privateKey);
    log('sig-> ' + ecc.sign(data, privateKey));
    //log("sig hash -> " + ecc.signHash(data, privateKey));
    //log("sha256hash -> " + ecc.sha256(data));
    log(' recover -> ' + ecc.recover(signature, data));
    //log(ecc.verify(signature, data, pubkey));

    var sig = ecc.Signature.fromString(signature).toBuffer();
    var sigPacked = new sig.constructor(sig.length + 1);
    sigPacked.set(Uint8Array.of(0), 0);
    sigPacked.set(sig, 1);
    var sigHex = sigPacked.toString('hex');
    log(' sigHex -> ' + sigHex);
}

async function ispkpaired(args) {
    if (args.length < 1) {
        log(`Usage:eosapi ispkpaired account. Example 'eosapi ispkpaired user`);
        return;
    }
    [account] = args;
    log('function:ispkpaired :: account=' + account);
    var trxIspkpaired = await eos.transaction(EXCHANGE_ACCOUNT, (contractuser) => {
        contractuser.ispkpaired({
            user: account
        });
    });
    return trxIspkpaired;
}

async function register(args) {
    if (args.length < 2) {
        log(
            `Usage:eosapi register {account_name user, bytes publickey}. Example 'eosapi register user1 "EOS819Z3ri1g7NUyZEnA5jyrFXw4joabtwcGWVqp41GLFLTtdE6p7"`
        );
        return;
    }
    [account, pubkey] = args;
    log('[account, pubkey] -> ' + account + ' :: ' + pubkey);

    if (!ecc.isValidPublic(pubkey)) {
        log(' Invalid pubkey!');
        return;
    }

    const pk = ecc.PublicKey(pubkey).toBuffer();
    var pkPacked = new pk.constructor(pk.length + 1);
    pkPacked.set(Uint8Array.of(0), 0);
    pkPacked.set(pk, 1);
    var pkHex = pkPacked.toString('hex');
    log('pkHex in bytes -> ' + pkHex);

    trxRegisterUser = await eos.transaction('exchange', (contractuser) => {
        contractuser.registeruser({
            user: account,
            publickey: pkHex
        }, {
            authorization: [account]
        });
    });
    //log(trxRegisterUser);
    return trxRegisterUser;
}

//TRADE
async function trade(args) {
    if (args.length < 11) {
        log(
            `Usage:eosapi trade amountbuy amountsell nonce amount
                        tradenonce tokenbuy tokensell makerfee
                        takerfee maker taker feeaccount.
       Example 'eosapi trade 500 500 1 500 1 "SYS" "EOS" 16 26 maker1 taker1 ledger'
       `
        );
        return;
    }
    [
        admin,
        amountbuy,
        amountsell,
        nonce,
        amount,
        tradenonce,
        tokenbuy,
        tokensell,
        makerfee,
        takerfee,
        maker,
        taker,
        feeaccount
    ] = args;

    // begin order, trade serialization, sign with maker1 and taker1 accounts and submit trade
    log('args-> ' + args);

    //getBN's
    var amountbuyBN = new BN(amountbuy);
    var amountBN = new BN(amount);
    var amountsellBN = new BN(amountsell);
    var nonceBN = new BN(nonce);
    var tradenonceBN = new BN(tradenonce);

    //construct order buffer
    var orderBuffer = serializeOrder(
        EXCHANGE_ACCOUNT,
        tokenbuy,
        tokensell,
        amountbuyBN,
        amountsellBN,
        nonceBN,
        MAKER_ACCOUNT
    );
    var orderHash = ecc.sha256(orderBuffer);
    var orderHashBuffer = Buffer.from(orderHash, 'hex');
    log('orderBuffer - orderHashBuffer -> ', orderHashBuffer);

    //construct trade buffer
    var tradeBuffer = serializeTrade(orderHashBuffer, amountBN, TAKER_ACCOUNT, tradenonceBN);
    var tradeHash = ecc.sha256(tradeBuffer);
    var tradeHashBuffer = Buffer.from(tradeHash, 'hex');

    log('tradeBuffer - tradeHashBuffer -> ', tradeHashBuffer);

    //construct makersignature - Using priv key to sign, with scatter, you'd construct signatureBuffer from scatter arbitrary sig
    var makerSignature = ecc.sign(orderBuffer, MAKER_PRIV_KEY);
    var makerSignatureBuffer = ecc.Signature.fromString(makerSignature).toBuffer();
    var makerSignaturePacked = new makerSignatureBuffer.constructor(makerSignatureBuffer.length + 1);
    makerSignaturePacked.set(Uint8Array.of(0), 0);
    makerSignaturePacked.set(makerSignatureBuffer, 1);
    //log("makerSignaturePacked -> " + makerSignaturePacked);

    //Test - Maker PUB_KEY recovery
    log(' recover maker PK from sig/orderBuffer -> ' + ecc.recover(makerSignature, orderBuffer));

    //construct takersignature
    var takerSignature = ecc.sign(tradeBuffer, TAKER_PRIV_KEY);
    var takerSignatureBuffer = ecc.Signature.fromString(takerSignature).toBuffer();
    var takerSignaturePacked = new takerSignatureBuffer.constructor(takerSignatureBuffer.length + 1);
    takerSignaturePacked.set(Uint8Array.of(0), 0);
    takerSignaturePacked.set(takerSignatureBuffer, 1);
    //log("takerSignaturePacked -> " + takerSignaturePacked);

    //Test - Taker PUB_KEY recovery
    log(' recover taker PK from sig/tradeBuffer -> ' + ecc.recover(takerSignature, tradeBuffer));

    //console log trade:payload dataset as json
    var p = {};
    p['amountbuy'] = amountbuyBN.toString();
    p['amountsell'] = amountsellBN.toString();
    p['nonce'] = nonceBN.toString();
    p['amount'] = amountBN.toString();
    p['tradenonce'] = tradenonceBN.toString();
    p['tokenbuy'] = toEosExtendedAssetString(tokenbuy, amountbuy);
    p['tokensell'] = toEosExtendedAssetString(tokensell, amountsell);
    p['makerfee'] = takerfee;
    p['takerfee'] = makerfee;
    p['maker'] = maker;
    p['taker'] = taker;
    p['feeaccount'] = feeaccount;
    p['admin'] = admin;
    p['makersig'] = makerSignaturePacked;
    p['takersig'] = takerSignaturePacked;

    log(' Payload -> ' + JSON.stringify(p, null, 4));

    var trxTrade = await eos.transaction('exchange', (contractuser) => {
        contractuser.trade({
            admin: p.admin,
            amountbuy: p.amountbuy,
            amountsell: p.amountsell,
            nonce: p.nonce,
            amount: p.amount,
            tradenonce: p.tradenonce,
            tokenbuy: p.tokenbuy,
            tokensell: p.tokensell,
            makerfee: p.makerfee,
            takerfee: p.takerfee,
            maker: p.maker,
            taker: p.taker,
            feeaccount: p.feeaccount,
            makersig: p.makersig,
            takersig: p.takersig
        }, {
            authorization: [EXCHANGE_ADMIN_ACCOUNT, feeaccount]
        });
    });
    //log(trxTrade);
    return trxTrade;
}

// Serialize, Hashing & Other Util Functions
function serializeOrder(exchangeAccount, tokenBuy, tokenSell, amountBuyBN, amountSellBN, nonceBN, makerAccount) {
    const serializedTokenSymbolSize = uint64_size * 2;
    const serializedSize = 5 * uint64_size + 2 * serializedTokenSymbolSize;
    var orderBuffer = Buffer.alloc(serializedSize);
    console.log('serializedSize: ', serializedSize);
    var offset = 0;
    orderBuffer.set(serializeAccountName(exchangeAccount), offset);
    offset += uint64_size;
    const tokenBuyBuffer = serializeExtendedSymbol(tokenBuy);
    assert(tokenBuyBuffer.length == serializedTokenSymbolSize);
    orderBuffer.set(tokenBuyBuffer, offset);
    console.log('tokenBuyBuffer: ', tokenBuyBuffer);
    offset += serializedTokenSymbolSize;
    orderBuffer.set(serializeUInt64BN(amountBuyBN), offset);
    offset += uint64_size;
    const tokenSellBuffer = serializeExtendedSymbol(tokenSell);
    assert(tokenSellBuffer.length == serializedTokenSymbolSize);
    orderBuffer.set(tokenSellBuffer, offset);
    log('tokenSellBuffer: ', tokenSellBuffer);
    offset += serializedTokenSymbolSize;
    orderBuffer.set(serializeUInt64BN(amountSellBN), offset);
    offset += uint64_size;
    orderBuffer.set(serializeUInt64BN(nonceBN), offset);
    offset += uint64_size;
    orderBuffer.set(serializeAccountName(makerAccount), offset);
    offset += uint64_size;
    assert(offset == serializedSize);
    //log('orderBuffer.length: ', orderBuffer.length);
    //log('orderBuffer: ', orderBuffer);
    return orderBuffer;
}

function serializeAccountName(accountName) {
    return serializeUInt64BN(BN(format.encodeName(accountName, /*littleEndian=*/ false)));
}

// Serializes a UInt64 BN into a binary buffer (little endian).
function serializeUInt64BN(bn) {
    assert(bn.isInteger());
    assert(bn.gte(0));
    assert(bn.lt(BN(2).pow(64)));

    var buf = Buffer.alloc(8);
    var byte;
    for (byte = 0; byte < 8; byte++) {
        const m = bn.mod(256).toNumber();
        buf.writeUInt8(m, byte);
        bn = bn.dividedToIntegerBy(256);
    }
    return buf;
}

function serializeExtendedSymbol(tokenSymbol) {
    var extendedSymbolBuffer = Buffer.alloc(uint64_size * 2);
    console.log('tokenSymbol: ', tokenSymbol);
    var precision;
    //console.log('tokenSymbol: ', eosTokenContract);
    if (tokenSymbol.indexOf("IQ") > -1) {
        precision = 3;
        extendedSymbolBuffer.set(serializeTokenSymbolName(tokenSymbol, precision));
        extendedSymbolBuffer.set(
            serializeUInt64BN(BN(format.encodeName("everipediaiq", /*littleEndian=*/ false))),
            uint64_size * 1
        );
    } else {
        precision = 4;
        extendedSymbolBuffer.set(serializeTokenSymbolName(tokenSymbol, precision));
        extendedSymbolBuffer.set(
            serializeUInt64BN(BN(format.encodeName(eosTokenContract, /*littleEndian=*/ false))),
            uint64_size * 1
        );
    }

    return extendedSymbolBuffer;
}

// The binary format of eosio::symbol_name:
// Byte 0: precision
// Byte 1-7: char[7] of the symbol name
function serializeTokenSymbolName(tokenSymbol, precision) {
    console.log(tokenSymbol + ' -> ' + precision);
    assert(tokenSymbol.length <= 7);
    var tokenSymbolBuffer = Buffer.alloc(uint64_size);
    tokenSymbolBuffer.writeUInt8(precision, 0);
    tokenSymbolBuffer.set(Buffer.from(tokenSymbol), 1);
    var offset;
    for (offset = tokenSymbol.length + 1; offset < uint64_size; offset++) {
        tokenSymbolBuffer.writeUInt8(0, offset);
    }
    //log('tokenSymbolBuffer: ', tokenSymbolBuffer);
    assert(tokenSymbolBuffer.length == uint64_size);
    return tokenSymbolBuffer;
}

function serializeTrade(orderHash, amountBN, takerAccount, tradeNonceBN) {
    const serializedSize = orderHash.length + 3 * uint64_size;
    var tradeBuffer = Buffer.alloc(serializedSize);
    var offset = 0;
    tradeBuffer.set(orderHash, offset);
    offset += orderHash.length;
    tradeBuffer.set(serializeUInt64BN(amountBN), offset);
    offset += uint64_size;
    tradeBuffer.set(serializeAccountName(takerAccount), offset);
    offset += uint64_size;
    tradeBuffer.set(serializeUInt64BN(tradeNonceBN), offset);
    offset += uint64_size;
    assert(offset == serializedSize);
    return tradeBuffer;
}

function toEosExtendedAssetString(token, amount) {
    var exAssetString;
    if (token.indexOf("IQ") > -1)
        //exAssetString = parseFloat(Math.round(amount * 100) / 100).toFixed(3) + ' ' + token + '@everipediaiq';
        exAssetString = parseFloat(amount / 1000).toFixed(3) + ' ' + token + '@everipediaiq';
    else
        //exAssetString = parseFloat(Math.round(amount * 100) / 100).toFixed(4) + ' ' + token + '@' + eosTokenContract;
        exAssetString = parseFloat(amount / 10000).toFixed(4) + ' ' + token + '@' + eosTokenContract;
    console.log("toEosExtendedAssetString -> " + exAssetString);
    return exAssetString;
}

//UberDEX API tests
// Test - Get trading symbols/pairs
app.get('/symbols', function (req, res) {
    request.get(process.env.DEX_API_SYMBOLS_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});

// Test - Get ticker for all tradeable symbols or specific symbol
app.get('/ticker', function (req, res) {
    request.get(process.env.DEX_API_TICKER_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});

app.get('/tickerBySymbol', function (req, res) {
    request.get(process.env.DEX_API_TICKER_BY_SYMBOL_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});


app.get('/orderBySymbolBuySide', function (req, res) {
    request.get(process.env.DEX_API_ORDERS_BUYSIDE_BY_SYMBOL_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});

app.get('/orderBySymbolSellSide', function (req, res) {
    request.get(process.env.DEX_API_ORDERS_SELLSIDE_BY_SYMBOL_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});


app.get('/orderbook', function (req, res) {
    request.get(process.env.DEX_API_ORDERBOOK_BY_SYMBOL_URL, function (err, result, body) {
        if (err) {
            log(err);
            res.status(500).send(err);
        } else {
            log(body);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(body /*JSON.stringify(data,null,2)*/ );
        }
    });
});

// Running a lean REST-API@8900
// get EOS Node Info
app.get('/info', function (req, res) {
    eos.getInfo(function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            log(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
            res.end();
        }
    });
});

//getBalances
app.post('/balance', function (req, res) {
    var body = req.body;
    var args = [body.user];
    getExBalance(args)
        .then(function (data) {
            log('balance::-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            if (data.processed.action_traces[0].console) {
                var consoleJsonFromTrxData = data.processed.action_traces[0].console.replace(/\'/g, '"');
                log('console json -> ' + consoleJsonFromTrxData);
            }
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//getBalances
app.post('/accountBalance', function (req, res) {
    var body = req.body;
    var args = [body.user, body.symbol];
    getBalance(args)
        .then(function (data) {
            log('accountBalance::-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//deposit
app.post('/deposit', function (req, res) {
    var body = req.body;
    var args = [body.account, body.amount];
    deposit(args)
        .then(function (data) {
            log('deposit:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//withdraw
app.post('/withdraw', function (req, res) {
    var body = req.body;
    var args = [body.admin, body.account, body.amount, body.nonce];
    withdraw(args)
        .then(function (data) {
            log('withdraw:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//withdraw via escape hatch (when exchange is compromised)
app.post('/withdrawViaEscapeHatch', function (req, res) {
    var body = req.body;
    var args = [body.account, body.amount, body.nonce];
    withdraweh(args)
        .then(function (data) {
            log('withdrawViaEscapeHatch:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//invalidate orders (when exchange is compromised)
app.post('/invalidateOrders', function (req, res) {
    var body = req.body;
    var args = [body.admin, body.account, body.nonce];
    invalidateOrders(args)
        .then(function (data) {
            log('invalidateOrders:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

// Set Escape Hatch params
app.post('/setLockParameters', function (req, res) {
    var body = req.body;
    var args = [body.admin, body.tradelockperiod, body.fundsreleaseperiod];
    setLockParameters(args)
        .then(function (data) {
            log('setLockParameters:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error -> : ' + err);
            res.status(400).send(err);
        });
});

// Set release period
app.post('/setReleasePeriod', function (req, res) {
    var body = req.body;
    var args = [body.admin, body.period];
    setReleasePeriod(args)
        .then(function (data) {
            log('setReleasePeriod:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});


// check if user public_key is paired
app.post('/ispkpaired', function (req, res) {
    var body = req.body;
    var args = [body.account];
    ispkpaired(args)
        .then(function (data) {
            log('ispkpaired:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            var keyExists = data.processed.action_traces[0].console.replace(/\'/g, "\"");
            //console.log(JSON.parse(keyExists).public_key_exists);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error in ispkpaired -> : ' + err);
            res.status(400).send(err);
        });
});


// Set admin
app.post('/setAdmin', function (req, res) {
    var body = req.body;
    var args = [body.account, body.isAdmin];
    setadmin(args)
        .then(function (data) {
            log('setAdmin:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

// Lock user account
app.post('/lock', function (req, res) {
    var body = req.body;
    var args = [body.account];
    lock(args)
        .then(function (data) {
            log('lock:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error in lock -> : ' + err);
            res.status(400).send(err);
        });
});

// unlock user account
app.post('/unlock', function (req, res) {
    var body = req.body;
    var args = [body.account];
    unlock(args)
        .then(function (data) {
            log('unlock:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error in unlock -> : ' + err);
            res.status(400).send(err);
        });
});

//withdrawadmin
app.post('/withdrawadmin', function (req, res) {
    var body = req.body;
    var args = [body.account, body.amount];
    withdrawadmin(args)
        .then(function (data) {
            log('withdrawadmin:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});
//registeruser
app.post('/register', function (req, res) {
    var body = req.body;
    var args = [body.account, body.pubkey];
    register(args)
        .then(function (data) {
            log('register:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//trade
app.post('/trade', function (req, res) {
    var body = req.body;
    var args = [
        body.admin,
        body.amountbuy,
        body.amountsell,
        body.nonce,
        body.amount,
        body.tradenonce,
        body.tokenbuy,
        body.tokensell,
        body.makerfee,
        body.takerfee,
        body.maker,
        body.taker,
        body.feeaccount
    ];
    trade(args)
        .then(function (data) {
            log('trade:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

//resetExchange
app.post('/reset', function (req, res) {
    var body = req.body;
    var args = [body.owner];
    resetExchange(args)
        .then(function (data) {
            log('reset:-> ' + JSON.stringify(data, null, 4));
            logTransaction(data);
            res.status(200).send(data /*JSON.stringify(data,null,2)*/ );
        })
        .catch(function (err) {
            log('Error-> : ' + err);
            res.status(400).send(err);
        });
});

function log(string) {
    if (process.env.API_VERBOSITY !== 'false') {
        console.log(string);
    }
}

function logTransaction(string) {
    if (process.env.STAKE_VERBOSITY !== 'false' && string.processed !== undefined) {
        var tco = {};
        var accountInfo = getAccount(['exchange']);
        accountInfo.then(function (data) {
            // console.log("ram_usage=" + data.ram_usage);
            tco.txid = string.processed.id;
            tco.cpu_usage_us = string.processed.receipt.cpu_usage_us;
            tco.net_usage_words = string.processed.receipt.net_usage_words;

            tco.net_usage = string.processed.net_usage;
            tco.action_name = string.processed.action_traces[0].act.name;
            tco.ram_usage = data.ram_usage;
            console.log(tco);
        });
    }
}

//UberDEX exdeposit api
async function exdeposit(contract, from, amount, key, nonce) {
    console.log("exdeposit: => contract:from:amount:key,nonce => " + contract + ":" + from + ":" + amount + ":" + key + ":" + nonce);
    var activeKey = await getAccountActiveKey(from);
    console.log("Account active key for:" + from + " is => " + activeKey);
    await register([from, activeKey]);
    var trxDeposit = await eos.transaction(contract, contractuser => {
        contractuser.transfer({
            from: from,
            to: EXCHANGE_ACCOUNT,
            quantity: amount,
            memo: "deposit"
        }, {
            authorization: [from]
        });
    });
    console.log("exdeposit => transaction:" + trxDeposit);
    return (trxDeposit);
}

//UberDEX exwithdraw api
async function exwithdraw(admin, account, amount, nonce) {
    console.log("exwithdraw: =>admin:from:amount:nonce => " + admin + ":" + account + ":" + amount + ":" + nonce);
    await setadmin(["admin", true]);
    return await withdraw([admin, account, amount, nonce]);
}

//get chain balance
//TODO: remove this test method from production codes
//TODO: remove hardcoded token symbols
async function getAllBalances(user, symbol) {
    var balances = [];
    const eosBalance = await eos.getCurrencyBalance('eosio.token', user, 'EOS');
    const iqBalance = await eos.getCurrencyBalance('everipediaiq', user, 'IQ');
    const abcBalance = await eos.getCurrencyBalance('eosio.token', user, 'ABC');
    const sysBalance = await eos.getCurrencyBalance('eosio.token', user, 'SYS');
    if (eosBalance.length > 0) balances.push(eosBalance[0]);
    if (iqBalance.length > 0) balances.push(iqBalance[0]);
    if (abcBalance.length > 0) balances.push(abcBalance[0]);
    if (sysBalance.length > 0) balances.push(sysBalance[0]);
    console.log("balance for account/user " + user + " is ", balances);
    return balances;
}

//Trade function
async function extrade(admin, amountbuy, amountsell, nonce, amount, tradenonce, tokenbuy, tokensell, makerfee, takerfee, maker, taker, feeaccount) {
    var trade = {};
    trade.admin = admin;
    trade.amountbuy = amountbuy;
    trade.amountsell = amountsell;
    trade.nonce = nonce;
    trade.amount = amount;
    trade.tradenonce = tradenonce;
    trade.tokenbuy = tokenbuy;
    trade.tokensell = tokensell;
    trade.makerfee = makerfee;
    trade.takerfee = takerfee;
    trade.maker = maker;
    trade.taker = taker;
    trade.feeaccount = feeaccount;

    // begin order, trade serialization, sign with maker1 and taker1 accounts and submit trade
    console.log('Trade ' + JSON.stringify(trade));

    //getBN's
    var amountbuyBN = new BN(trade.amountbuy);
    var amountBN = new BN(trade.amount);
    var amountsellBN = new BN(trade.amountsell);
    var nonceBN = new BN(trade.nonce);
    var tradenonceBN = new BN(trade.tradenonce);

    //construct order buffer
    var orderBuffer = serializeOrder(
        EXCHANGE_ACCOUNT,
        trade.tokenbuy,
        trade.tokensell,
        amountbuyBN,
        amountsellBN,
        nonceBN,
        MAKER_ACCOUNT
    );
    var orderHash = ecc.sha256(orderBuffer);
    var orderHashBuffer = Buffer.from(orderHash, 'hex');
    console.log('orderBuffer - orderHashBuffer -> ', orderHashBuffer);

    //construct trade buffer
    var tradeBuffer = serializeTrade(orderHashBuffer, amountBN, TAKER_ACCOUNT, tradenonceBN);
    var tradeHash = ecc.sha256(tradeBuffer);
    var tradeHashBuffer = Buffer.from(tradeHash, 'hex');

    console.log('tradeBuffer - tradeHashBuffer -> ', tradeHashBuffer);

    //construct makersignature - Using priv key to sign, with scatter, you'd construct signatureBuffer from scatter arbitrary sig
    var makerSignature = ecc.sign(orderBuffer, MAKER_PRIV_KEY);
    var makerSignatureBuffer = ecc.Signature.fromString(makerSignature).toBuffer();
    var makerSignaturePacked = new makerSignatureBuffer.constructor(makerSignatureBuffer.length + 1);
    makerSignaturePacked.set(Uint8Array.of(0), 0);
    makerSignaturePacked.set(makerSignatureBuffer, 1);
    //log("makerSignaturePacked -> " + makerSignaturePacked);

    //Test - Maker PUB_KEY recovery
    console.log(' recover maker PK from sig/orderBuffer -> ' + ecc.recover(makerSignature, orderBuffer));

    //construct takersignature
    var takerSignature = ecc.sign(tradeBuffer, TAKER_PRIV_KEY);
    var takerSignatureBuffer = ecc.Signature.fromString(takerSignature).toBuffer();
    var takerSignaturePacked = new takerSignatureBuffer.constructor(takerSignatureBuffer.length + 1);
    takerSignaturePacked.set(Uint8Array.of(0), 0);
    takerSignaturePacked.set(takerSignatureBuffer, 1);
    //log("takerSignaturePacked -> " + takerSignaturePacked);

    //Test - Taker PUB_KEY recovery
    console.log(' recover taker PK from sig/tradeBuffer -> ' + ecc.recover(takerSignature, tradeBuffer));

    //console log trade:payload dataset as json
    var p = {};
    p['amountbuy'] = amountbuyBN.toString();
    p['amountsell'] = amountsellBN.toString();
    p['nonce'] = nonceBN.toString();
    p['amount'] = amountBN.toString();
    p['tradenonce'] = tradenonceBN.toString();
    p['tokenbuy'] = toEosExtendedAssetString(tokenbuy, amountbuy);
    p['tokensell'] = toEosExtendedAssetString(tokensell, amountsell);
    p['makerfee'] = makerfee;
    p['takerfee'] = takerfee;
    p['maker'] = maker;
    p['taker'] = taker;
    p['feeaccount'] = feeaccount;
    p['admin'] = admin;
    p['makersig'] = makerSignaturePacked;
    p['takersig'] = takerSignaturePacked;

    console.log(' Payload -> ' + JSON.stringify(p, null, 4));

    var trxTrade = await eos.transaction('exchange', (contractuser) => {
        contractuser.trade({
            admin: p.admin,
            amountbuy: p.amountbuy,
            amountsell: p.amountsell,
            nonce: p.nonce,
            amount: p.amount,
            tradenonce: p.tradenonce,
            tokenbuy: p.tokenbuy,
            tokensell: p.tokensell,
            makerfee: p.makerfee,
            takerfee: p.takerfee,
            maker: p.maker,
            taker: p.taker,
            feeaccount: p.feeaccount,
            makersig: p.makersig,
            takersig: p.takersig
        }, {
            authorization: [EXCHANGE_ADMIN_ACCOUNT, fee_account]
        });
    });
    //log(trxTrade);
    return trxTrade;
}

async function exregisteruser(account, pubkey) {
    log('exregisteruser ' + account + ' :: ' + pubkey);

    if (!ecc.isValidPublic(pubkey)) {
        log(' Invalid pubkey!');
        return;
    }

    const pk = ecc.PublicKey(pubkey).toBuffer();
    var pkPacked = new pk.constructor(pk.length + 1);
    pkPacked.set(Uint8Array.of(0), 0);
    pkPacked.set(pk, 1);
    var pkHex = pkPacked.toString('hex');
    log('pkHex in bytes -> ' + pkHex);

    trxRegisterUser = await eos.transaction('exchange', (contractuser) => {
        contractuser.registeruser({
            user: account,
            publickey: pkHex
        }, {
            authorization: [account]
        });
    });
    return trxRegisterUser;
}

//exbalances
async function getExBalances(account) {
    log('getExBalances => for account:' + account);
    var trxGetExBalance = await eos.transaction('exchange', (contractuser) => {
        contractuser.getbalances({
            owner: account
        }, {
            authorization: [account]
        });
    });
    var balanceStr = (trxGetExBalance.processed.action_traces[0].console).replace(/\'/g, "\"");
    var balanceJson = JSON.parse('[' + balanceStr.replace(/\}{/g, "\},{") + ']');
    var balances = [];
    console.log("Balances size are" + balanceJson);
    for (var i = 0, len = balanceJson.length; i < len; i++) {
        var balance = {};
        balance.account = balanceJson[i].account;
        balance.precision = parseInt(balanceJson[i].token.charAt(0));
        balance.symbol = balanceJson[i].token.substring(2, balanceJson[i].token.length);
        balance.amount = balanceJson[i].amount;
        balances.push(balance);
    }
    return balances;
    //return trxGetExBalance;
}

//offline scatter based withdrawal with admin sig and user-scatter-arb-sig
async function exOfflineWithdrawal(
    user,
    token,
    amount,
    nonce,
    headers,
    userSignature,
) {
    return await sendOfflineWithdrawal(user, token, parseFloat(amount), nonce, headers, userSignature);
}

async function sendOfflineWithdrawal(user, token, amount, nonce, headers, userSignature) {
    console.log("Cur Nonce is " + nonce);
    var extendedAsset;
    //simply deal with IQ specifics for now
    //TODO deal with different contracts and precisions here
    if (token.indexOf("IQ") > -1) {
        extendedAsset = (amount).toFixed(3) + " " + token + "@everipediaiq";
    } else if (token.indexOf("EOS") > -1) {
        extendedAsset = (amount).toFixed(4) + " " + token + "@eosio.token";
    } else throw new Error(token + " is currently not available for withdrawals!!!");

    const withdrawParams = {
        from: user,
        nonce: nonce,
        quantity: extendedAsset,
        admin: ADMIN_ACCOUNT
    };

    const offlineEos = Eos({
        chainId,
        httpEndpoint,
        keyProvider: [process.env.ADMIN_KEY],
        transactionHeaders: headers
    });
    const offlineOptions = {
        broadcast: false,
        sign: true,
        authorization: [{
                actor: user,
                permission: 'active'
            },
            {
                actor: ADMIN_ACCOUNT,
                permission: 'active'
            }
        ],
    };
    await offlineEos.fc.abiCache.abi(
        EXCHANGE_ACCOUNT,
        exchangeABI.abi

    );
    const offlineContract = await offlineEos.contract(EXCHANGE_ACCOUNT);
    const offlineWithdraw = await offlineContract.withdraw(withdrawParams, offlineOptions);
    const offlineTransaction = offlineWithdraw.transaction;
    //offlineTransaction.signatures.push(withdrawTransaction.signatures[0]);
    offlineTransaction.signatures.push(userSignature);
    console.log('offlineWithdraw:', offlineWithdraw);
    console.log('offlineWithdraw.transaction.actions:', offlineWithdraw.transaction.transaction.actions[0]);

    const dispatchEos = Eos({
        chainId,
        httpEndpoint,
        keyProvider: [process.env.ADMIN_KEY]
    });
    const dispatchOptions = {
        authorization: [{
                actor: user,
                permission: 'active'
            },
            {
                actor: ADMIN_ACCOUNT,
                permission: 'active'
            }
        ],
        broadcast: true,
        debug: true,
        sign: true,
        keyProvider: [process.env.ADMIN_KEY]
    };

    const result = await dispatchEos.pushTransaction(offlineTransaction);
    console.log('result:', result);
    return result;
}

//start EOS-API service
var server = app.listen(process.env.EOS_API_PORT, function () {
    //var host = process.env.host;//os.hostname();
    var port = server.address().port;
    log('EOS-Exchange Contract API listening at http://localhost:' + port);
    log('Running mode => ' + mode);
    log('eosConfig =>' + JSON.stringify(eosNetwork, null, 2));
});

module.exports.exdeposit = exdeposit;
module.exports.exwithdraw = exwithdraw;
module.exports.getAllBalances = getAllBalances;
module.exports.getExBalances = getExBalances;
module.exports.extrade = extrade;
module.exports.exregisteruser = exregisteruser;
module.exports.exOfflineWithdrawal = exOfflineWithdrawal;