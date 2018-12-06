import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Datafeed from '../TVChartContainer/api/index';
import $ from "jquery";
import logoss from '../logo_main.png';
import ScatterJS from 'scatterjs-core';
import Trading from './trading';
import BN from 'bignumber.js';
import ecc from 'eosjs-ecc'

import dp from '../../app.json';
var adminURL = dp['url'];
var apiId = dp['apiId'];
var pricePrecision=5;
var currencyPrecision=5;

const serialize = require('../../serialize');



function tabsOnes(e)
{
    e.preventDefault();
    $('.tabsOnes').addClass('ui-tabs-active');
    $('.tabsTwos').removeClass('ui-tabs-active');
    $('#tabss-1').css('display', 'block');
    $('#tabss-2').css('display', 'none');
}
function tabsTwos(e)
{
    e.preventDefault();
    $('.tabsOnes').removeClass('ui-tabs-active');
    $('.tabsTwos').addClass('ui-tabs-active');
    $('#tabss-2').css('display', 'block');
    $('#tabss-1').css('display', 'none');
}

function tabsOne(e)
{
    e.preventDefault();
    $('.tabsOne').addClass('ui-tabs-active');
    $('.tabsTwo').removeClass('ui-tabs-active');
    $('.tabsThree').removeClass('ui-tabs-active');
    $('#tabs-1').css('display', 'block');
    $('#tabs-2').css('display', 'none');
    $('#tabs-3').css('display', 'none');
}

function tabsTwo(e)
{
    e.preventDefault();
    $('.tabsOne').removeClass('ui-tabs-active');
    $('.tabsTwo').addClass('ui-tabs-active');
    $('.tabsThree').removeClass('ui-tabs-active');
    $('#tabs-1').css('display', 'none');
    $('#tabs-2').css('display', 'block');
    $('#tabs-3').css('display', 'none');
}

function tabsThree(e)
{
    e.preventDefault();
    $('.tabsOne').removeClass('ui-tabs-active');
    $('.tabsTwo').removeClass('ui-tabs-active');
    $('.tabsThree').addClass('ui-tabs-active');
    $('#tabs-1').css('display', 'none');
    $('#tabs-2').css('display', 'none');
    $('#tabs-3').css('display', 'block');
}
function handlelight(e)
  {
    e.preventDefault();
    $('.lightT').css('display', 'none');
    $('.darkt').css('display', 'inline-block');
    $('body').removeClass('darkVersion');
    $('body').addClass('lightVersion');
    $('.demo-big-content').removeClass('darkVersion');
    var url = new URL(window.location.href);
var c = url.searchParams.get("opt");

    const widgetOptions = {
        debug: false,
        symbol: c+':EOS',
        datafeed: Datafeed,
        interval: '60',
        container_id: 'tv_chart_container',
        library_path: '/charting_library/',
        locale: getLanguageFromURL() || 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
        overrides: {
            "mainSeriesProperties.showCountdown": true,
            "paneProperties.background": "#fff",
            "paneProperties.vertGridProperties.color": "#363c4e",
            "paneProperties.horzGridProperties.color": "#363c4e",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor" : "#AAA",
            "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
            "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        }
    };
   window.tvWidget = new window.TradingView.widget(widgetOptions);
  }


  function handledark(e)
  {
    e.preventDefault();
    
    var url = new URL(window.location.href);
var c = url.searchParams.get("opt");

    const widgetOptions = {
        debug: false,
        symbol: c+':EOS',
        datafeed: Datafeed,
        interval: '60',
        container_id: 'tv_chart_container',
        library_path: '/charting_library/',
        locale: getLanguageFromURL() || 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
        overrides: {
            "mainSeriesProperties.showCountdown": true,
            "paneProperties.background": "#52565a",
            "paneProperties.vertGridProperties.color": "#363c4e",
            "paneProperties.horzGridProperties.color": "#363c4e",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor" : "#AAA",
            "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
            "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        }
        };
     window.tvWidget = new window.TradingView.widget(widgetOptions);
    $('.darkt').css('display', 'none');
    $('.lightT').css('display', 'inline-block');
    $('body').removeClass('lightVersion');
    $('body').addClass('darkVersion');
    $('.demo-big-content').addClass('darkVersion');
  }
  
  
  function handledefualt(e)
  {
      
    var bColor='#52565a';
     if($('body').hasClass('lightVersion'))
      {
        $('.darkt').css('display', 'inline-block');
$('.lightT').css('display', 'none');
bColor='#fff';
      }
      else
      {
        $('.darkt').css('display', 'none');
$('.lightT').css('display', 'inline-block');
bColor='#52565a';
      }
//    $('.darkt').css('display', 'none');
//    $('.lightT').css('display', 'inline-block');
//    $('body').removeClass('lightVersion');
//    $('body').addClass('darkVersion');   
var url = new URL(window.location.href);
var c = url.searchParams.get("opt");

fetch('https://api.byzanti.ne/symbols?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N')
.then(response => response.json())
.then(data => {
   data.forEach(function(v,i){
    if(v.symbol===c)
    {
       pricePrecision=v.price_precision;
       currencyPrecision=v.currency_precision;
    }
   });
});
    //e.preventDefault();
    const widgetOptions = {
        debug: false,
        symbol: c+':EOS',
        datafeed: Datafeed,
        interval: '60',
        container_id: 'tv_chart_container',
        library_path: '/charting_library/',
        locale: getLanguageFromURL() || 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
        overrides: {
            "mainSeriesProperties.showCountdown": true,
            "paneProperties.background": bColor,
            "paneProperties.vertGridProperties.color": "#363c4e",
            "paneProperties.horzGridProperties.color": "#363c4e",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor" : "#AAA",
            "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
            "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        }
        };
    window.tvWidget = new window.TradingView.widget(widgetOptions);
  }
  

function handlePublic(e){
    e.preventDefault();
     var scatter =ScatterJS.scatter;
     if(scatter.identity){   alert(scatter.identity.publicKey);}
//console.log(scatter.identity.publicKey);
}

function handlesign(e) {
    e.preventDefault();
    $('.signInPopup ').fadeIn();
  }
  
function handleSignout(e){
    e.preventDefault();
     ScatterJS.scatter.forgetIdentity();
 window.location.reload();
}
  

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
// function reloadPage()
// {
//     window.location.reload();
// }
function tackerView(e) {
    e.preventDefault();
    var views = e.target.id;
    $('#view'+views).fadeIn();
}
function closeView(e){
    e.preventDefault();
    $('.tradeWrap').fadeOut();
}



  function handleBuy(e)
{
    e.preventDefault();
     var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
                  var bprice= parseFloat($('#buyPrice').val());
       var sellPrice= parseFloat($('#sellPrice').val());
       var price= parseFloat($('#price').val());
       var tps=1;
       var myuri='';
       if($('#apiType').val()==='make')
       {
        var datas = {
            "side": "BUY",
            "assetBuy": c,
            "assetSell": "EOS",
            "amountBuy": bprice,
            "amountSell": sellPrice,
            "price": price,
            "expires": "3d",
            "type": tps,
            "useraccount": 'taker1'
      };
    myuri='https://api.byzanti.ne/orderMake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
   
       }
       else
       {
           bprice= parseFloat($('#amountbuy').val());
      sellPrice= parseFloat($('#amountsell').val());
       var pricess= parseFloat($('#prices').val());
       var maker = $('#maker').val();
       var makerexchange = $('#makerexchange').val();
       var ids = $('#ID').val();
       var side= $('#side').val();
       if(side==='BUY')
       {
          datas = 
    {
        "orderId": ids,
        "assetBuy": c,
        "assetSell": 'EOS',
        "amountBuy": sellPrice,
        "amountSell": bprice,
        "price": pricess,
        "taker": "taker1",
        "maker": maker,
        "takerExchange": "uberdex",
        "makerExchange": makerexchange
      };
       }
       else
       {
          datas = 
    {
        "orderId": ids,
        "assetBuy": c,
        "assetSell":'EOS',
        "amountBuy": bprice,
        "amountSell": sellPrice,
        "price": pricess,
        "taker": "taker1",
        "maker": maker,
        "takerExchange": "uberdex",
        "makerExchange": makerexchange
      };
       }
    
      myuri='https://api.byzanti.ne/orderTake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
       }
  
     fetch(myuri, {
     method: 'POST',headers: {
  //  'Accept': 'application/json',
    'Content-Type': 'application/json',
  },  body: JSON.stringify(datas)})
        .then(response => response.json())
        .then(data => {if($('#apiType').val()==='make'){ if(data.orderId){
            
            $('#contentToShow').html('Order Id : '+data.orderId);$('#msg').html('Success');$('.sellAlart').show();}else if(data.code){$('#contentToShow').html('Error Code : '+data.code);$('#msg').html('Error');$('.sellAlart').show();}}else{ if(data.tradeId){$('#contentToShow').html('Trade Id : '+data.tradeId+'<br />result : Created <br />BlockNumber : '+data.blockNumber+'<br />TransactionId : <a target="_blank" href="/transaction/?trxID='+data.transactionId+'&blocknumber='+data.blockNumber+'">'+data.transactionId+'</a>');$('#msg').html('Success');$('.sellAlart').show();}else{$('#contentToShow').html('Status Code : '+data.statusCode+"<br /> Message : "+data.message+"<br /> Code : "+data.code+"<br /> Order Id : "+ids);$('#msg').html('Error');$('.sellAlart').show();}}//window.location.reload()
      }
        );
        
     
}
 function handleSell(e)
{
    e.preventDefault();
    
     var url = new URL(window.location.href);
        var c = url.searchParams.get("opt");
        var price= parseFloat($('#priceTwo').val());
        var bprice= parseFloat($('#BuyPricetwo').val());
        var sellPrice= parseFloat($('#sellPricetwo').val());
      
        var tps=1;
        var myuri='';
        if($('#apiType').val()==='make')
        {
            var datas = {
                "side": "SELL",
                "assetBuy": "EOS",
                "assetSell": c,
                "amountBuy": bprice,
                "amountSell": sellPrice,
                "price": price,
                "expires": "3d",
                "type": tps,
                "useraccount": 'taker1'
          };
     myuri='https://api.byzanti.ne/ordermake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        }
        else
        {
                bprice= parseFloat($('#amountbuy').val());
        sellPrice= parseFloat($('#amountsell').val());
       var pricess= parseFloat($('#prices').val());
       var maker = $('#maker').val();
       var makerexchange = $('#makerexchange').val();
       var ids = $('#ID').val();
      var side= $('#side').val();
       if(side==='BUY')
       {
           datas = 
    {
        "orderId": ids,
        "assetBuy": 'EOS',
        "assetSell":c,
        "amountBuy": bprice,
        "amountSell": sellPrice,
        "price": pricess,
        "taker": "taker1",
        "maker": maker,
        "takerExchange": "uberdex",
        "makerExchange": makerexchange
      };
       }
       else
       {
           datas = 
    {
        "orderId": ids,
        "assetBuy": 'EOS',
        "assetSell":c,
        "amountBuy": bprice,
        "amountSell": sellPrice,
        "price": pricess,
        "taker": "taker1",
        "maker": maker,
        "takerExchange": "uberdex",
        "makerExchange": makerexchange
      };
       }
    
      myuri='https://api.byzanti.ne/orderTake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        }
     
      
     fetch(myuri, {
     method: 'POST',headers: {
  //  'Accept': 'application/json',
    'Content-Type': 'application/json',
  },  body: JSON.stringify(datas)})
        .then(response => response.json())
        .then(data => {if($('#apiType').val()==='make'){ if(data.orderId){
            $('#contentToShow').html('Order Id : '+data.orderId);$('#msg').html('Success');$('.sellAlart').show();}else if(data.code){$('#contentToShow').html('Error Code : '+data.code);$('#msg').html('Error');$('.sellAlart').show();}}else{ if(data.tradeId){$('#contentToShow').html('Trade Id : '+data.tradeId+'<br />result : Created <br />BlockNumber : '+data.blockNumber+'<br />TransactionId : <a target="_blank" href="/transaction/?trxID='+data.transactionId+'&blocknumber='+data.blockNumber+'">'+data.transactionId+'</a>');$('#msg').html('Success');$('.sellAlart').show();}else{$('#contentToShow').html('Status Code : '+data.statusCode+"<br /> Message : "+data.message+"<br /> Code : "+data.code+"<br /> Order Id : "+ids);$('#msg').html('Error');$('.sellAlart').show();}}//window.location.reload()
      
       }
    );
        
}
function changeSellPrice1(e)
{
    // e.preventDefault();
    var price= parseFloat(e.target.value);
    var sellPrice= parseFloat($('#price').val());
    $('#apiType').val('make');
    $('#sellPrice').val((price*sellPrice).toFixed(pricePrecision));
}
function changeSellPrice(e)
{
    e.preventDefault();
    var price= parseFloat(e.target.value);
    var sellPrice= parseFloat($('#price').val());
    $('#buyPrice').val((price/sellPrice).toFixed(currencyPrecision));
    $('#apiType').val('make');
}
function changeBuyPrice1(e)
{
    e.preventDefault();
     var price= parseFloat(e.target.value);
    var sellPrice= parseFloat($('#priceTwo').val());
    $('#sellPricetwo').val((price*sellPrice).toFixed(pricePrecision));
    $('#apiType').val('make');
}
function changeBuyPrice(e)
{
    e.preventDefault();
     var price= parseFloat(e.target.value);
    var sellPrice= parseFloat($('#priceTwo').val());
    $('#BuyPricetwo').val((price/sellPrice).toFixed(currencyPrecision));
    $('#apiType').val('make');
}

 var url = new URL(window.location.href);
     var     c = url.searchParams.get("opt");

     
    //  function handlechart(){
    //     alert('ads');
    // }

    function tackerViews(e) {
        e.preventDefault();
        var views = e.target.id;
        $('#views'+views).fadeIn();
    }
    function closeViews(e){
        e.preventDefault();
        $('.tradeWrap').fadeOut();
    }
    
    
    function orderView(e) {
        e.preventDefault();
        var views = e.target.id;
      //  console.log(views);
        $('#view'+views).fadeIn();
    }
    function closeOrder(e){
        e.preventDefault();
        $('.orderWrap').fadeOut();
    }
    
    
    
class tradingHead extends Component{
     
	static defaultProps = {
		symbol: c+':EOS',
		interval: '60',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
    };
    
    constructor(props) {
        super(props);
    
        this.state = {
          tricker: [],
          orders: [],
          orderBook: [],
          orderBooks: [],
          orderBookss: [],
          tacker: [],
          blc: [],
          apil:'SEED',
          amounttype:'plus',
          myamount:"",
          mysign:"",
            Orders: [],
            OrderSells: [],
            tradebook: [],
            useraccount:'',
            colors: [],
            logo: [],
            tradeHistory:[],
            orderBooksss:[]
            
        };
        this.refresh_data = this.refresh_data.bind(this);
        this.handleClicks = this.handleClicks.bind(this);         
        this.handleClick = this.handleClick.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
        this.handleTakerSell = this.handleTakerSell.bind(this);    
    this.cancelOrder= this.cancelOrder.bind(this);
      }
      cancelOrder=(e)=>{
        e.preventDefault();
         var order_id = e.target.id;
         $('#view'+order_id).fadeOut();
           let datas = {
              "orderId": order_id,
      "orderHash": "ascascasc"
        };
         fetch('https://api.byzanti.ne/orderCancel?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
         method: 'POST',headers: {
      //  'Accept': 'application/json',
        'Content-Type': 'application/json',
      },  body: JSON.stringify(datas)})
            .then(response => response.json())
            .then(data =>this.refresh_data ); 
            
    }
      handleClick=(orderId)=> {
    let API="https://api.byzanti.ne/orderById?orderId="+orderId+"&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N";
   fetch(API)
        .then(response => response.json())
        .then(data => {
             var amount_two = data.amountSell;
    var amount_twos = data.amountBuy;
    var amount = data.price;
    
     var ID = orderId;
    var assetbuy = data.assetSell;
    var assetsell = data.assetBuy;
    var amountsell = data.amountBuy;
    var amountbuy = data.amountSell;
    var prices = data.price;
    var maker = data.useraccount;
    var makerexchange = data.source;
    var side = data.side;
    
    document.getElementById('ID').value = ID;
    document.getElementById('assetbuy').value = assetbuy;
    document.getElementById('assetsell').value = assetsell;
    document.getElementById('amountsell').value = amountsell;
    document.getElementById('amountbuy').value = amountbuy;
    document.getElementById('maker').value = maker;
    document.getElementById('prices').value = prices;
    document.getElementById('makerexchange').value = makerexchange;
    document.getElementById('side').value = side;
    document.getElementById('priceTwo').value = '';
    document.getElementById('BuyPricetwos').value = '';
    document.getElementById('BuyPricetwo').value = '';
    document.getElementById('sellPricetwo').value = '';
  //  console.log(amount_twos);
   $('#apiType').val('take');
    document.getElementById('price').value = amount;
    document.getElementById('buyPrices').value = amount_two;
    document.getElementById('buyPrice').value = amount_two;
    document.getElementById('sellPrice').value = amount_twos;
            });
   
    
  }
handleClicks=(orderId,e)=> {
  let API1="https://api.byzanti.ne/orderById?orderId="+orderId+"&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N";
   fetch(API1)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
             var amount_four = data.amountBuy;
    var amount_fours = data.amountSell;
    var amounts = data.price;

    var ID = orderId;
    
    var assetbuy = data.assetSell;
    var assetsell = data.assetBuy;
    var amountsell = data.amountBuy;
    var amountbuy = data.amountSell;
    var prices = data.price;
    var maker = data.useraccount;
    var makerexchange = data.source;
    var side = data.side;
    
    document.getElementById('ID').value = ID;
    document.getElementById('assetbuy').value = assetbuy;
    document.getElementById('assetsell').value = assetsell;
    document.getElementById('amountsell').value = amountsell;
    document.getElementById('amountbuy').value = amountbuy;
    document.getElementById('maker').value = maker;
    document.getElementById('prices').value = prices;
    document.getElementById('makerexchange').value = makerexchange;
    document.getElementById('side').value = side;
    document.getElementById('priceTwo').value = amounts;
    document.getElementById('BuyPricetwos').value = amount_four;
    document.getElementById('BuyPricetwo').value = amount_four;
    document.getElementById('sellPricetwo').value = amount_fours;
    $('#apiType').val('take');
     document.getElementById('price').value = '';
    document.getElementById('buyPrices').value = '';
    document.getElementById('buyPrice').value = '';
    document.getElementById('sellPrice').value = '';
        });
        
  
  }
refresh_data(e)
{
     e.preventDefault();
        var url = new URL(window.location.href);
         var c = url.searchParams.get("opt");
      
        var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APISr = 'https://api.byzanti.ne/orderBook?symbol='+c+'&side=BUY&size=150&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APIS = 'https://api.byzanti.ne/orderBook?symbol='+c+'&side=BUY&size=10&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APISS = 'https://api.byzanti.ne/orders?symbol='+c+'&side=BUY&size=22&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var orderTaker = 'https://api.byzanti.ne/tradebook?symbol='+c+'&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
         var orderHistory= 'https://api.byzanti.ne/tradesByUser?user=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
          fetch(orderHistory)
        .then(response => response.json())
        .then(data => {this.setState({ tradeHistory: data });});
    
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ tricker: data }); });
        
        fetch(APISS)
        .then(response => response.json())
        .then(data => {this.setState({ orders: data }); });
        
        fetch(APIS)
        .then(response => response.json())
        .then(data => {this.setState({ orderBook: data['asks'], orderBooks: data['bids'] }); });
        
        fetch(APISr)
        .then(response => response.json())
        .then(data => {this.setState({ orderBookss: data['asks'], orderBooksss: data['bids'] }); });
        
         fetch(orderTaker)
        .then(response => response.json())
        .then(data => {this.setState({ tacker: data }); var i=0; data.map(bids=>{
        if(i===0){if(bids.assetBuy===c){this.setState({mysign:"plus"});}else{this.setState({mysign:"minus"})}this.setState({myamount:bids.price});i++;}    });});
        
    
        fetch('https://api.byzanti.ne/exbalance?account=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N')
        .then(response => response.json())
        .then(data => {this.setState({blc:data}); });
        
        var tradebook = 'https://api.byzanti.ne/tradebook?symbol='+c+'&size=10&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var NAPI = 'https://api.byzanti.ne/ordersByUser?user=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var OrderSell = 'https://api.byzanti.ne/orders?symbol=IQ&side=SELL&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(NAPI)
        .then(response => response.json())
        .then(data => {this.setState({ Orders: data }); });
        fetch(OrderSell)
        .then(response => response.json())
        .then(data => {this.setState({ OrderSells: data }); });
        
        fetch(tradebook)
        .then(response => response.json())
        .then(data => {this.setState({ tradebook: data }); });
$('.sellAlart').hide();
$('#price').val('');
$('#buyPrice').val('');
$('#sellPrice').val('');
$('#priceTwo').val('');
$('#BuyPricetwo').val('');
$('#sellPricetwo').val('');
}
    
    componentDidMount() {
        
      /*   var url = new URL(window.location.href);
        console.log(url.href.substr(url.href.lastIndexOf('/') + 1));*/
     
        var url = new URL(window.location.href);
         var c = url.searchParams.get("opt");
         var bColor='dark';
      if($('body').hasClass('lightVersion'))
      {
            $('.darkt').css('display', 'none');
    $('.lightT').css('display', 'inline-block');
bColor='#fff';
      }
      else
      {
           $('.darkt').css('display', 'inline-block');
   $('.lightT').css('display', 'none');
bColor='#52565a';
      }

          handledefualt();

        var API = 'https://api.byzanti.ne/ticker?symbol='+c+'&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APISr = 'https://api.byzanti.ne/orderBook?symbol='+c+'&side=BUY&size=150&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APIS = 'https://api.byzanti.ne/orderBook?symbol='+c+'&side=BUY&size=10&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var APISS = 'https://api.byzanti.ne/orders?symbol='+c+'&side=BUY&size=22&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var orderTaker = 'https://api.byzanti.ne/tradebook?symbol='+c+'&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
          var orderHistory= 'https://api.byzanti.ne/tradesByUser?user=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
          fetch(orderHistory)
        .then(response => response.json())
        .then(data => {this.setState({ tradeHistory: data });});
    
        fetch(API)
        .then(response => response.json())
        .then(data => {this.setState({ tricker: data }); });
        
        fetch(APISS)
        .then(response => response.json())
        .then(data => {this.setState({ orders: data }); });
        
        fetch(APIS)
        .then(response => response.json())
        .then(data => {this.setState({ orderBook: data['asks'], orderBooks: data['bids'] }); });
        
        fetch(APISr)
        .then(response => response.json())
        .then(data => {this.setState({ orderBookss: data['asks'], orderBooksss: data['bids'] }); });
        
        fetch(orderTaker)
        .then(response => response.json())
        .then(data => {this.setState({ tacker: data }); var i=0; data.map(bids=>{
        if(i===0){if(bids.assetBuy===c){this.setState({mysign:"plus"})}else{this.setState({mysign:"minus"})}this.setState({myamount:bids.price});i++;}    });});
        
    
        fetch('https://api.byzanti.ne/exbalance?account=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N')
        .then(response => response.json())
        .then(data => {this.setState({blc:data}); });
        
        var tradebook = 'https://api.byzanti.ne/tradebook?symbol='+c+'&size=10&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var NAPI = 'https://api.byzanti.ne/ordersByUser?user=taker1&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        var OrderSell = 'https://api.byzanti.ne/orders?symbol=IQ&side=SELL&size=100&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N';
        fetch(NAPI)
        .then(response => response.json())
        .then(data => {this.setState({ Orders: data }); });
        fetch(OrderSell)
        .then(response => response.json())
        .then(data => {this.setState({ OrderSells: data }); });
        
        fetch(tradebook)
        .then(response => response.json())
        .then(data => {this.setState({ tradebook: data }); });

        fetch(adminURL+'/getColors/'+apiId)
        .then(response => response.json())
        .then(data => {if(data.logo==='')
        {
            this.setState({colors:'#0e9caf'});this.setState({logo:logoss});
        }
        else
        {
            this.setState({colors:data.theme_color}); 
            $('#logoImg').attr('src',adminURL+'/images/byzantine/'+data.logo);
        }
        }).catch(data => {
            this.setState({colors:'#0e9caf'});this.setState({logo:logoss});
        });
           const widgetOptions = {
			debug: false,
			symbol: this.props.symbol,
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			overrides: {
				"mainSeriesProperties.showCountdown": true,
				"paneProperties.background": bColor,
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			}
        };

		window.TradingView.onready(() => {
			const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

			widget.onChartReady(() => {
				//console.log('Chart has loaded!')
			});
        });
        
    }

    async handleBuy(e) {

    //    var amBuy= parseFloat($('#buyPrice').val());
    //    var amSell= parseFloat($('#sellPrice').val());
    //    var price= parseFloat($('#price').val());

        let scatter = this.props.scatterID;
    
        var amountB = BN(359.4218).multipliedBy(10000);
        var amountS = BN(0.4144).multipliedBy(10000);
    
        amountB = Math.floor(amountB / 10);
    
        //console.log(amountB, amountS);
     
        let amountBuy = new BN(amountB);
        let amountSell = new BN(amountS);
        let nonceBN = new BN(1);
    
        let orderBuffer = serialize.serializeOrder('exchange', 'IQ', 'EOS',  amountBuy, amountSell, nonceBN, 'ubermaker');
      
        let orderHash = ecc.sha256(orderBuffer);
    
    
           let datas = {
              side: "SELL",
              assetBuy: "EOS",
              assetSell: "IQ",
              amountBuy: 0.4144,
              amountSell: 359.4218,
              price: 0.001153,
              type: 2,
              hash: orderHash,
            //   expires: new Date(new Date(info.head_block_time + 'Z').getTime() + 60 * 1000).toISOString().split('.')[0],
              nonce: 1,
              useraccount: scatter.identity.accounts[0].name
            };
    
        let signature = ecc.sign(orderBuffer, '5Kbhuw48LRBY25KMDD2KH59EAgvHnhh66S863Nvz1PZBY9X2uph');   
        
        //let signature = await scatter.getArbitrarySignature('EOS6P7wP3HsdmGPsrrabPrweWQnTgxqdY8RTaUmVMVeXJec6hyNVm', orderBuffer, "test ordermake sig", false);    
        datas.hash = orderHash; 
        datas.signature = signature;
        //console.log("datas: ", datas);
    
         fetch('https://api.byzanti.ne/orderMake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
         method: 'POST',headers: {
      //  'Accept': 'application/json',
        'Content-Type': 'application/json',
      },  body: JSON.stringify(datas)})
            .then(response => {
                response.json()
                //console.log("response: ", response);
            })
            .then(() => {
                fetch(`https://api.byzanti.ne/ordersByUser?user=${this.props.scatterID.identity.accounts[0].name}&api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N`)
                .then(response => response.json())
                .then(data => {
                    this.props.updateOpenOrders({ openOrders: data });
                    //console.log("orders: ", data);
                });
    
            });
         
    }
    
    async handleTakerSell() {
    
        const network = {
            blockchain: 'eos',
            protocol: 'https://cors-anywhere.herokuapp.com/http',
            host: '13.52.54.111',
            eosVersion: 'bf28f8bb',
            port: 8888,
            chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            debug: false,
            verbose: false,
            latency: 200,
            sign: true
        }
        
      //  var url = new URL(window.location.href);
        //var c = url.searchParams.get("opt");
    
        const account = this.props.scatterID.identity.accounts[0].name;
        //console.log("account: ", account);
    
        // var bprice= parseFloat($('#buyPrice').val());
        // var eosAm= parseFloat($('#sellPrice').val());
        // var price = parseFloat($('#price').val());
    
        const scatter = this.props.scatterID;
    
        //const eos = scatter.eos(network, Eos)
        
    
    
        var amountB = BN(359.422).multipliedBy(1000);
        var amountS = BN(0.4144).multipliedBy(10000);
    
        // amountB = Math.floor(amountB / 10);
    
        //console.log(amountB, amountS);
     
        let amountBuy = new BN(amountB);
        let amountSell = new BN(amountS);
        let nonceBN = new BN(1);

        // console.log(
        //     'exchange', 'IQ', 'EOS', amountBuy, amountSell, nonceBN, 'ubermaker'
        // )
        
        let orderBuffer = serialize.serializeOrder('exchange', 'IQ', 'EOS', amountBuy, amountSell, nonceBN, 'ubermaker');
      
        let orderHash = ecc.sha256(orderBuffer);
    
        var orderHashBuffer = Buffer.from(orderHash, 'hex');
        
    
        let tradeBuffer = serialize.serializeTrade(orderHashBuffer, amountBuy, account, nonceBN)
        let data = {
                assetBuy: 'IQ',
                assetSell: 'EOS',
                amountBuy: 359.4218,
                amountSell: 0.4144,
                price: 0.001153,
                taker: account,
                takerExchange: 'uberdex',
                makerExchange: 'uberdex'
          }
    
          let pubKey = await scatter.getPublicKey('eos');
          //console.log("pub key: ", pubKey)
      
        //   data.signature = await ecc.sign(tradeBuffer, '5J4xG1aygXGJCNgkG4JVVQirgpxJ9M1s1Auh24ebVtYJ21QLfdv');
          data.hash = ecc.sha256(tradeBuffer);
        
         
          data.signature = await scatter.getArbitrarySignature(pubKey, tradeBuffer, "test ordertake", false);
          data.orderId = 'IEVgZ2cBKKlqgDKXtYdW'
          data.maker = 'ubermaker'
    
    
          fetch('https://api.byzanti.ne/orderTake/?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N', {
                method: 'POST', headers: {
        'Content-Type': 'application/json',
      },  body: JSON.stringify(data)})
            .then(response => {
                response.json()
                //console.log("response: ", response);
            })
    
    
      }
    
    render(){
        const { tricker } = this.state;
        const { orderBook } = this.state;
        const { orderBooks } = this.state;
        const { orderBookss } = this.state;
          const { orderBooksss } = this.state;
       
        const { tacker } = this.state;
        
        const { Orders } = this.state;
        const { tradebook } = this.state;
        const {tradeHistory} =this.state;
        var isCancel='';
        var amountToShow='';
        var sides='';
      // console.log(strlen(orderBooks));
        return(
            <div>
                
                <div className="wellcomBanner background exchangeHeader" style={{'background': this.state.colors}}>
                    <div className="header">
                        <div className="container clearfix">
                            <div className="logo">
                            <Link to="/" className="link"><img src={logoss} className="App-logo" id="logoImg" alt="" /></Link>
                            </div>
                            <div className="menuSections">
                                <nav>
                                    <ul>
                                        <li><Link to="/exchange/?opt=IQ&contract=everipediaiq" className="link">Exchange</Link></li>
                                        <li><Link to="/market" className="link">Markets</Link></li>
                                        <li><Link to="/contact" className="link">Supports</Link></li>
                                        {this.props.scatterID ?
                                        <span>
                                            <li id="signout"><a href="/"  onClick={handleSignout}>Sign out</a></li>
                                            <li><Link to="/account" className="bgs" >{(this.props.scatterID.identity)?this.props.scatterID.identity.accounts[0].name:""}</Link></li>
                                        </span> :
                                        <span>
                                            <li id="signin"><a  href="/" onClick={handlesign}>Sign In</a></li>
                                            <li><a href="/" className="bgs"  onClick={handlePublic}>Get Started</a></li>
                                        </span>
                                        }
                                    </ul>
                                </nav>
                                <div className="othersOptions">
                                    <a href="/" className="fullscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                                    <a href="/" className="smallscreen"><i className="fa fa-expand-arrows-alt"> </i></a>
                                    <a href="/" className="lightT" onClick={handlelight}><i className="fa fa-lightbulb"> </i></a>
                                    <a href="/" className="darkt" onClick={handledark}><i className="fa fa-lightbulb"> </i></a>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Trading />

            <div className="tradingCenter">
                <div className="container clearfix">
                    <div className="lefts">
                        <div id="tabs">
                            <ul>
                                <li className="tabsOne ui-tabs-active"><a href="#tabs-1" onClick={tabsOne}>Depth</a></li>
                                <li className="tabsTwo"><a href="#tabs-2" onClick={tabsTwo}>Buy</a></li>
                                <li className="tabsThree"><a href="#tabs-3" onClick={tabsThree}>Sell</a></li>
                            </ul>
                            <div id="tabs-1">
                               <table className="mainTable">
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {tricker.map((hit, i) => <th key={i}>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                            <th>Exchange</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {orderBooks.map((bids, i) => {
                                          
                                            return  <tr key={i} onClick={this.handleClicks.bind(this,bids.orderId)}>
                                                <td className='plus' id={bids.orderId} data-id={bids.orderId} data-assetbuy={bids.assetSell} data-assetsell={bids.assetBuy} data-amountsell={bids.amountBuy} data-amountbuy={bids.amountSell} data-price={bids.price} data-maker={bids.useraccount} data-makerexchange={bids.source} data-side={bids.side}   >{bids.price}</td>
                                                <td id={bids.amountBuy}>{bids.amountBuy}</td>
                                                <td id={bids.amountSell}>{bids.amountSell}</td>
                                                <td id={bids.source}>{bids.source}</td>
                                            </tr>
                                        }
                                        )}
                               
                                        <tr>
                                            <td colSpan="4" className={"lastTrans "+this.state.mysign}><span id="lastValue">{this.state.myamount}</span><i className="fa fa-arrow-up"></i><i className="fa fa-arrow-down"></i></td>
                                        </tr>
                                        {orderBook.map((ask, i) => 
                                            <tr key={i}>
                                                <td className='minus' id={ask.price} data-id={ask.orderId} data-assetbuy={ask.assetSell} data-assetsell={ask.assetBuy} data-amountsell={ask.amountBuy} data-amountbuy={ask.amountSell} data-price={ask.price} data-maker={ask.useraccount} data-makerexchange={ask.source} data-side={ask.side} onClick={this.handleClick.bind(this,ask.orderId)}>{ask.price}</td>
                                                 <td id={ask.amountSell}>{ask.amountSell}</td>
                                                <td id={ask.amountBuy}>{ask.amountBuy}</td>
                                               
                                                <td id={ask.source}>{ask.source}</td>
                                            </tr>
                                        )}
                                        
                                    </tbody>
                                </table>
                            </div>
                            <div id="tabs-2">
                            <table className="tableScroll">
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {tricker.map((hit, i) => <th key={i}>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                            <th>Exchange</th>
                                    </tr>
                                    </thead>
                                    
                                    <tbody>
                                        
                                        {orderBookss.map((ask, i) => 
                                          <tr key={i}>
                                                <td className='plus' id={ask.price} data-id={ask.orderId} data-assetbuy={ask.assetSell} data-assetsell={ask.assetBuy} data-amountsell={ask.amountBuy} data-amountbuy={ask.amountSell} data-price={ask.price} data-maker={ask.useraccount} data-makerexchange={ask.source} data-side={ask.side} onClick={this.handleClick.bind(this,ask.orderId)}>{ask.price}</td>
                                                 <td id={ask.amountSell}>{ask.amountSell}</td>
                                                 <td id={ask.amountBuy}>{ask.amountBuy}</td>
                                              
                                                <td id={ask.source}>{ask.source}</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                            <div id="tabs-3">
                            <table className="tableScroll">
                                    <thead>
                                        <tr>
                                            <th>Price(EOS)</th>
                                            {tricker.map((hit, i) => <th key={i}>{hit.symbol} </th>  )}
                                            <th>Total(EOS)</th>
                                            <th>Exchange</th>
                                    </tr>
                                    </thead>
                                    
                                   
                                    <tbody>
                                        {orderBooksss.map((bids, i) => 
                                               <tr key={i} onClick={this.handleClicks.bind(this,bids.orderId)}>
                                                <td className='minus' id={bids.orderId} data-id={bids.orderId} data-assetbuy={bids.assetSell} data-assetsell={bids.assetBuy} data-amountsell={bids.amountBuy} data-amountbuy={bids.amountSell} data-price={bids.price} data-maker={bids.useraccount} data-makerexchange={bids.source} data-side={bids.side}   >{bids.price}</td>
                                                <td id={bids.amountBuy}>{bids.amountBuy}</td>
                                                <td id={bids.amountSell}>{bids.amountSell}</td>
                                                <td id={bids.source}>{bids.source}</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                     <div className="center">
                    <div id={ this.props.containerId } className={ 'TVChartContainer' }></div>

                        <div className="clearfix"></div>
                        <div className="calculator">
                            <h4>Limit Order </h4>
                            <div className="clearfix">
                                <div>
                                    {tricker.map((hit, i) =>
                                        <h6  key={i}>Buy {hit.symbol} <span>Balance:
                                        {(this.props.scatterID ? 
                                            (this.props.balance.EOS ? this.props.balance.EOS : 0.0000 ) : 
                                            this.state.blc[0].amount) +" "+this.state.blc[0].symbol}</span></h6>
                                    )}
                                    <label>Price <span>EOS</span> </label>
                                    <input type="number" id="price" />
                                    <label>Amount {tricker.map((hit, i) =>
                                        <span key={i}>{hit.symbol} </span>
                                    )}</label>
                                     <input type="hidden" id="buyPrices"  />
                                       <input type="number" id="buyPrice" onChange={changeSellPrice1} />
                                     
                                   <label>Total <span>EOS </span> </label>
                                       <input type="number"  id="sellPrice" onChange={changeSellPrice} />
                            
                              {tricker.map((hit, i) => {
                                        return <span key={i}>
                                                    <input type="submit" value={'Buy '+hit.symbol} onClick={handleBuy} className="background" />
                                                    {this.props.scatterID ? <input type="submit" value={'Buy '+hit.symbol+ ' with Scatter'} onClick={this.handleTakerSell} className="background" /> :
                                                    <input type="submit" value={'Signin'} onClick={() => { $('.signInPopup ').fadeIn();}} className="background" />}
                                                </span>
                                    })}
                                    </div>


                                <div className="red">
                                    {tricker.map((hit, i) =>
                                        <h6 key={i}>Sell {hit.symbol} <span>Balance: 
                                        {(this.props.scatterID ? 
                                            (this.props.balance[hit.symbol] ? this.props.balance[hit.symbol] : 0.0000 ) : 
                                            this.state.blc[1].amount) +" "+this.state.blc[1].symbol}
                                            </span></h6>
                                    )}
                                    <label>Price <span>EOS</span></label>
                                    <input type="number"  id="priceTwo" />

                                    <label>Amounts <span>EOS</span> </label>
                                   <input type="number" id="sellPricetwo" onChange={changeBuyPrice} />
                                  
                                    <input type="hidden" id="BuyPricetwos"/>

                                    <input type="hidden" id="ID"/>
                                    <input type="hidden" id="assetbuy"/>
                                    <input type="hidden" id="assetsell"/>
                                    <input type="hidden" id="amountsell"/>
                                    <input type="hidden" id="amountbuy"/>
                                    <input type="hidden" id="prices"/>
                                    <input type="hidden" id="maker"/>
                                    <input type="hidden" id="makerexchange"/>
                                    <input type="hidden" id="side"/>
                                    <input type="hidden" id="apiType" />
                                    
                                   <label>Total  {tricker.map((hit, i) =>
                                        <span key={i}>{hit.symbol} </span>
                                    )}
                                    </label>
                                       <input type="number" id="BuyPricetwo"  onChange={changeBuyPrice1} />  
                                       {tricker.map((hit, i) => {
                                        return <span key={i}>
                                                 <input type="submit" value={'Sell '+hit.symbol} onClick={handleSell} className="background" />
                                                {this.props.scatterID ? <input type="submit" value={'Sell '+hit.symbol+ ' with Scatter'} onClick={this.handleBuy} className="background" /> :
                                                <input type="submit" value={'Signin'} onClick={() => { $('.signInPopup ').fadeIn();}} className="background" />}
                                            </span>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="orderTacker">
                            <h4>Latest transactions</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Price(EOS)</th>
                                        {tricker.map((hit, i) => <th key={i}>{'Amount('+hit.symbol+')'} </th>  )}
                                        <th>Exchange</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tacker.map((tackers, i) => 
                                        <tr key={i}>
                                            <td className={'plus '+tackers.assetBuy} id={tackers.tradeId}  onClick={tackerView}>{tackers.price}</td>
                                            <td>{tackers.amountBuy}</td>
                                            <td>{tackers.takerExchange}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {tacker.map((tackers, i) =>
                    
                        <div key={i} className="tradeWrap" id={'view'+tackers.tradeId}>
                            <div className="tradeView">
                                <a href="/" className="closeView"  onClick={closeView}><i className="fa fa-times"></i></a>
                                <div className="viewTop">
                                    <ul>
                                        <li><span>Price</span>{tackers.price} EOS</li>
                                        <li><span>Amount</span>{tackers.amountBuy} {tackers.assetBuy}</li>
                                        <li><span>Total</span>{tackers.amountSell} {tackers.assetBuy}</li>
                                        <li><span>Date</span> {tackers.created}</li>
                                    </ul>
                                </div>
                                <div className="viewBottom clearfix">
                                    <ul>
                                        <li><h3  style={{'background': this.state.colors}}>Maker</h3></li>
                                        <li><span>EOS Account Name</span> <cite>{tackers.maker}</cite> </li>
                                        <li><span>Total</span> <cite>{tackers.amountBuy} {tackers.assetBuy}</cite> </li>
                                        <li><span>Fee</span> <cite>{tackers.makerFee} {tackers.assetBuy}</cite> </li>
                                        <li><span>Maker Exchange</span> {tackers.makerExchange} <cite></cite> </li>
                                        <li><span>Time stamp</span> <cite>{tackers.timestamp}</cite> </li>
                                        <li><span>Trade Id</span> <cite  style={{'color': this.state.colors}} className="tradeId">{tackers.tradeId}</cite> </li>
                                        <li><span>Transaction Id</span> <a  style={{'color': this.state.colors}} target="_blank" rel="noopener noreferrer" href={'/transaction/?trxID='+tackers.transactionId+'&blocknumber='+tackers.blockNumber}>{tackers.transactionId}</a></li>
                                    </ul>
                                    
                                    <ul>
                                        <li><h3 style={{'background': this.state.colors}}>Taker</h3></li>
                                        <li><span>EOS Account Name</span> <cite>{tackers.taker}</cite> </li>
                                        <li><span>Total</span> <cite>{tackers.amountSell} {tackers.assetBuy}</cite> </li>
                                        <li><span>Fee</span> <cite>{tackers.takerFee} {tackers.assetBuy}</cite> </li>
                                        <li><span>Taker Exchange</span> <cite>{tackers.takerExchange}</cite> </li>
                                        <li><span>Time stamp</span> <cite>{tackers.timestamp}</cite> </li>
                                        <li><span>Trade Id</span> <cite style={{'color': this.state.colors}} className="tradeId">{tackers.tradeId}</cite> </li>
                                        <li><span>Transaction Id</span> <a  style={{'color': this.state.colors}} target="_blank" rel="noopener noreferrer" href={'/transaction/?trxID='+tackers.transactionId+'&blocknumber='+tackers.blockNumber}>{tackers.transactionId}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div> 
                    )}

                    <div className="sellAlart">
                        <div className="innrs">
                            <h3 id="msg"> </h3>
                            <p id="contentToShow"></p>
                            <a href="/" onClick={this.refresh_data} className="closeView">Ok</a>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                
                {Orders.map((order, i) =>
                    
                    <div  key={i} className="orderWrap" id={'view'+order.orderId}>
                        <div className="orderView">
                            <a href="/" className="closeView"  onClick={closeOrder}><i className="fa fa-times"></i></a>
                            <h3  style={{'color': this.state.colors}}>Order Detail</h3>
                            <div className="viewBottom clearfix">
                                <ul>
                                    <li><span>Account Name</span> <cite>{order.useraccount}</cite> </li>
                                    <li><span>Source</span> <cite>{order.source}</cite> </li>
                                    <li><span>Total</span> <cite>{order.amountBuy} {order.assetBuy}</cite> </li>
                                    <li><span>Price</span> <cite>{order.price}</cite> </li>
                                    <li><span>Fee Discount</span> <cite>{order.feediscount}</cite> </li>
                                    <li><span>Expires</span> <cite>{order.expires}</cite> </li>
                                    <li><span>Type</span> <cite>{order.type}</cite> </li>
                                    <li><span>Time stamp</span> <cite>{order.timestamp}</cite> </li>
                                    <li><span>Date</span> <cite>{order.created}</cite> </li>
                                    <li><span>Order Id</span> <cite style={{'color': this.state.colors}} className="tradeId">{order.orderId}</cite> </li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                )}
                
            
                <div className="orderTab">
                <div className="orderD">
                    <div className="container clearfix">
                        <ul>
                            <li className="tabsOnes ui-tabs-active"><a href="#tabss-1" onClick={tabsOnes}>Open Order</a></li>
                            <li className="tabsTwos"><a href="#tabss-2" onClick={tabsTwos}>Order History</a></li>
                        </ul>
                        <div id="tabss-1">  
                        <table className="openOrder">
                            <thead>
                        
                                <tr>
                                    <th>Coin</th>
                                    <th>Type </th>
                                    <th>Order Id </th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                    <th>Timestamp</th>
                                    <th>Status </th>
                                    <th>Account Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Orders.map((order, i) =>{
                                    if(order.cancelled==='1')
                                    {
                                         isCancel='Cancelled';
                                    }
                                    else
                                    {
                                         isCancel='Active';
                                    }
                                    if(order.amountBuy>0)
                                    {
                                         amountToShow=order.amountBuy;
                                    }
                                    else
                                    {
                                         amountToShow=order.amountSell;
                                    }
                                    
                                    var url = new URL(window.location.href);
                                    var c = url.searchParams.get("opt");
                                    
                                    if(order.assetBuy===c || order.assetSell===c)
                                    {
                                        return   <tr key={i}>
                                            <td className={'plus '+order.assetBuy}  id={order.orderId}  onClick={orderView} >{order.assetBuy}</td>
                                            <td id={order.orderId}  onClick={orderView}>{order.side}</td>
                                            <td id={order.orderId}  onClick={orderView}>{order.orderId}</td>
                                            <td id={order.orderId}  onClick={orderView}>{parseFloat(order.price).toFixed(4)}</td>
                                            <td id={order.orderId}  onClick={orderView}>{parseFloat(amountToShow).toFixed(4)}</td>
                                            <td id={order.orderId}  onClick={orderView}>{order.created}</td>
                                            <td id={order.orderId}    ><a href="/" id={order.orderId} onClick={this.cancelOrder}>{isCancel}</a></td>
                                            <td id={order.orderId}  onClick={orderView}>{order.useraccount}</td>
                                        </tr>
                                    }
                                    else{
                                        return ""
                                    }
                                    
                            
                                
                                } )}
                            </tbody>
                        </table>
                        </div> 
                        <div id="tabss-2">
                        <table>
                            <thead>
                        
                                <tr>
                                    <th>Coin</th>
                                    <th>Type </th>
                                    <th>Trade ID </th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                    <th>Timestamp</th>
                                    <th>Taker </th>
                                    <th>Maker </th>
                                </tr>
                            </thead>
                            <tbody>
                            {tradeHistory.map((tradebooks, i) =>{
                                if(tradebooks.taker==='taker1')
                                {
                                    if(tradebooks.assetBuy==='EOS')
                                    {
                                         sides= 'Sell';
                                    }
                                    else
                                    {
                                         sides='Buy';
                                    }
                                    return <tr key={i}>
                                    <td className={'plus '+tradebooks.assetBuy}  id={tradebooks.tradeId}  onClick={tackerViews}  >{tradebooks.assetBuy}</td>
                                    <td id={tradebooks.tradeId}>{sides}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.tradeId}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.price}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.amountBuy}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.created}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.taker}</td>
                                    <td id={tradebooks.tradeId}>{tradebooks.maker}</td>
                                </tr>
                                }
                                else
                                {return ""}
                                
                            }
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>

            {tradebook.map((tradebooks, i) =>
                    
                    <div key={i} className="tradeWrap as" id={'views'+tradebooks.tradeId}>
                        <div className="tradeView">
                            <a href="/" className="closeView"  onClick={closeViews}><i className="fa fa-times"></i></a>
                            <div className="viewTop">
                                <ul>
                                    <li><span>Price</span>{tradebooks.price} {tradebooks.assetBuy}</li>
                                    <li><span>Amount</span>{tradebooks.amountBuy} {tradebooks.assetBuy}</li>
                                    <li><span>Total</span>{tradebooks.amountSell} {tradebooks.assetBuy}</li>
                                    <li><span>Date</span> {tradebooks.created}</li>
                                </ul>
                            </div>
                            <div className="viewBottom clearfix">
                                <ul>
                                    <li><h3 style={{'background': this.state.colors}}>Maker</h3></li>
                                    <li><span>EOS Account Name</span> <cite>{tradebooks.maker}</cite> </li>
                                    <li><span>Total</span> <cite>{tradebooks.amountBuy} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Fee</span> <cite>{tradebooks.makerFee} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Maker Exchange</span> {tradebooks.makerExchange} <cite></cite> </li>
                                    <li><span>Time stamp</span> <cite>{tradebooks.timestamp}</cite> </li>
                                    <li><span>Trade Id</span> <cite  style={{'color': this.state.colors}} className="tradeId">{tradebooks.tradeId}</cite> </li>
                                            <li><span>Transaction Id</span> <a style={{'color': this.state.colors}} target="_blank" rel="noopener noreferrer" href={'/transaction/?trxID='+tradebooks.transactionId+'&blocknumber='+tradebooks.blockNumber}>{tradebooks.transactionId}</a></li>
                                  
                                </ul>
                                
                                <ul>
                                    <li><h3 style={{'background': this.state.colors}}>Taker</h3></li>
                                    <li><span>EOS Account Name</span> <cite>{tradebooks.taker}</cite> </li>
                                    <li><span>Total</span> <cite>{tradebooks.amountSell} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Fee</span> <cite>{tradebooks.takerFee} {tradebooks.assetBuy}</cite> </li>
                                    <li><span>Taker Exchange</span> <cite>{tradebooks.takerExchange}</cite> </li>
                                    <li><span>Time stamp</span> <cite>{tradebooks.timestamp}</cite> </li>
                                    <li><span>Trade Id</span> <cite style={{'color': this.state.colors}}  className="tradeId">{tradebooks.tradeId}</cite> </li>
                                          <li><span>Transaction Id</span> <a style={{'color': this.state.colors}} target="_blank" rel="noopener noreferrer" href={'/transaction/?trxID='+tradebooks.transactionId+'&blocknumber='+tradebooks.blockNumber}>{tradebooks.transactionId}</a></li>
                                  
                                </ul>
                            </div>
                        </div>
                    </div> 
                )}
        </div>
        </div>
        )
    }
}

export default tradingHead;