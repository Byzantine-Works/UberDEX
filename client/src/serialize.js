import assert from 'assert';
import Eos from 'eosjs';
import BN from 'bignumber.js';

var {
    format
} = Eos.modules;

const uint64_size = 8;

function serializeAccountName(accountName) {
    return serializeUInt64BN(BN(format.encodeName(accountName, /*littleEndian=*/ false)));
}

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
    //console.log('tokenSymbol: ', eosTokenContract);""
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
            serializeUInt64BN(BN(format.encodeName("eosio.token", /*littleEndian=*/ false))),
            uint64_size * 1
        );
    }

    return extendedSymbolBuffer;
}


export function serializeOrder(exchangeAccount, tokenBuy, tokenSell, amountBuyBN, amountSellBN, nonceBN, makerAccount) {
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
    console.log('tokenSellBuffer: ', tokenSellBuffer);
    offset += serializedTokenSymbolSize;
    orderBuffer.set(serializeUInt64BN(amountSellBN), offset);
    offset += uint64_size;
    orderBuffer.set(serializeUInt64BN(nonceBN), offset);
    offset += uint64_size;
    orderBuffer.set(serializeAccountName(makerAccount), offset);
    offset += uint64_size;
    assert(offset == serializedSize);
   
    return orderBuffer;
}

export function serializeTrade(orderHash, amountBN, takerAccount, tradeNonceBN) {
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
