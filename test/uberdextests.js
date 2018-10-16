"use strict";
const request = require('request');
require("dotenv").config();

// Test - Get trading symbols/pairs
request.get(process.env.DEX_API_SYMBOLS_URL, function (err, res, body) {
    if (err)
        console.log(err);
    else
        console.log(body);
});


// Test - Get ticker for all tradeable symbols
request.get(process.env.DEX_API_TICKER_URL, function (err, res, body) {
    if (err)
        console.log(err);
    else
        console.log(body);
});


// Test - Get ticker by symbol
request.get(process.env.DEX_API_TICKER_BY_SYMBOL_URL, function (err, res, body) {
    if (err)
        console.log(err);
    else
        console.log(body);
});