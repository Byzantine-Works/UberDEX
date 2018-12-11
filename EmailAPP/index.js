'use strict'
const express = require('express');
var cors = require('cors');
const app = express();
const cookieParser =require('cookie-parser');

var bodyParser = require('body-parser');
var path    = require("path");
 var mailgun = require("mailgun-js");
var api_key = 'key-9c4de02e7da81c8ebb0d4c7a708aada1';
var DOMAIN = 'clarkhogan.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.options('*',cors());
app.use(cors());
app.use(express.static(__dirname + '/views'));
var sess={uid:""};
app.post('/sendingEmail',function(req,res){
    var email= req.body.email;
    var name= req.body.names;
    var phone= req.body.phone;
    var msg= req.body.msg;
   
var data = {
  from: 'postmaster@clarkhogan.com',
  to: 'hello@byzanti.ne',
  subject: 'Hello',
  text: "Name : "+name+" \n Email : "+email+" \n Phone : "+phone+"\n Message : "+msg
};

mailgun.messages().send(data, function (error, body) {
  if (error) {
     res.json({'error':'1'});
  } else {
  res.json({'error':'0','msg':body.message});
  }
});
  

});
const port = process.env.PORT || 8080;

app.listen(port, () => console.log("server running on port "+port));
