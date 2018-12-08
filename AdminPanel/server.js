'use strict'
const express = require('express');
var cors = require('cors');
const app = express();
//support@uberDexinc.com
const cookieParser = require('cookie-parser');
const fetch = require("node-fetch");

var bodyParser = require('body-parser');
var path = require("path");
var session = require('express-session');
var fs = require('fs');
var nodemailer = require('nodemailer');
var randomNumber = require('random-number');
var mailgun = require("mailgun-js");
var api_key = 'key-9c4de02e7da81c8ebb0d4c7a708aada1';
var DOMAIN = 'clarkhogan.com';
var mailgun = require('mailgun-js')({
  apiKey: api_key,
  domain: DOMAIN
});

app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
const multer = require("multer");
const upload = multer({
  dest: "views/images/byzantine"
});
const uploads = multer({
  dest: "views/images/services"
});
const upload1 = multer({
  dest: "views/images/features"
});
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  // hosts: [ 'https://elastic:h3sBffTRNTOFWZa6mETl6Hqx@7f900d6b22c9439f8fe3ae1951d560be.us-central1.gcp.cloud.es.io:9243']
  hosts: ['http://127.0.0.1:9200']
});
app.use(session({
  secret: 'jamil@active',
  resave: false,
  saveUninitialized: true,
}));

app.options('*', cors());
app.use(cors());
app.use(express.static(__dirname + '/views'));
var sess = {
  uid: ""
};
app.get('/', (req, res) => {

  sess = req.session;
  if (sess.uid) {
    client.search({
      index: 'exchanges',
      type: '_doc',

    }, function (error, response, status) {
      if (error) {
        console.log("search error: " + error)
      } else {

        //  console.log(response);
        res.render('admin', {
          data: response.hits
        });

      }
    });

    //  res.redirect('/admin');
  } else {
    res.render('login');
  }



});
app.get('/deleteExchange/:id', async function (req, res) {
  let dl = await client.delete({
    index: 'exchanges',
    type: '_doc',
    id: req.params.id

  }, function (err, resp, status) {
    res.redirect('/');
  });


});
app.get('/deleteNews/:id', async function (req, res) {
  let dl = await client.delete({
    index: 'campaigntickers',
    type: '_doc',
    id: req.params.id

  }, function (err, resp, status) {
    console.log(err);
  });
  res.redirect('/');
});
app.post('/postFeatures', upload1.any(), async function (req, res) {


  var logoDark = "";
  var logoLight = "";
  var logoLight2 = "";
  var logoDark2 = "";
  var logoLight3 = "";
  var logoDark3 = "";
  var logoLight4 = "";
  var logoDark4 = "";
  for (var i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const targetPath = path.join(__dirname, "./views/images/features/" + req.files[i].originalname);
    fs.rename(tempPath, targetPath, err => {
      //    data.serviceDark= req.files[0].originalname;
    });
    if (req.files[i].fieldname == 'featureDark') {
      logoDark = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureLight') {
      logoLight = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureDark2') {
      logoDark2 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureLight2') {
      logoLight2 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureDark3') {
      logoDark3 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureLight3') {
      logoLight3 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureDark4') {
      logoDark4 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'featureLight4') {
      logoLight4 = req.files[i].originalname;
    }



  }
  if (logoLight == "") {
    logoLight = req.body.fll;
  }
  if (logoDark == '') {
    logoDark = req.body.fld;
  }
  if (logoLight2 == "") {
    logoLight2 = req.body.fll2;
  }
  if (logoDark2 == '') {
    logoDark2 = req.body.fld2;
  }
  if (logoLight3 == "") {
    logoLight3 = req.body.fll3;
  }
  if (logoDark3 == '') {
    logoDark3 = req.body.fld3;
  }
  if (logoLight4 == "") {
    logoLight4 = req.body.fll4;
  }
  if (logoDark4 == '') {
    logoDark4 = req.body.fld4;
  }

  var data = {
    "featureTitle": req.body.featureTitle1,
    "featureMainTitle": req.body.featureMainTitle1,
    "featureDesc": req.body.featureDesc1,
    "uid": req.body.urlId,
    "featureId": req.body.featureId1,
    "featureLight": logoLight,
    "featureDark": logoDark
  };
  var data2 = {
    "featureTitle": req.body.featureTitle2,
    "featureMainTitle": req.body.featureMainTitle2,
    "featureDesc": req.body.featureDesc2,
    "uid": req.body.urlId,
    "featureId": req.body.featureId2,
    "featureLight": logoLight2,
    "featureDark": logoDark2
  };
  var data3 = {
    "featureTitle": req.body.featureTitle3,
    "featureMainTitle": req.body.featureMainTitle3,
    "featureDesc": req.body.featureDesc3,
    "uid": req.body.urlId,
    "featureId": req.body.featureId3,
    "featureLight": logoLight3,
    "featureDark": logoDark3
  };
  var data4 = {
    "featureTitle": req.body.featureTitle4,
    "featureMainTitle": req.body.featureMainTitle4,
    "featureDesc": req.body.featureDesc4,
    "uid": req.body.urlId,
    "featureId": req.body.featureId4,
    "featureLight": logoLight4,
    "featureDark": logoDark4
  };

  let dl = await client.deleteByQuery({
    index: 'features',
    // type: 'posts',
    body: {
      query: {
        match: {
          "uid": req.body.urlId
        }
      }
    }
  });

  let rp = await client.index({
    index: 'features',
    type: '_doc',
    body: JSON.stringify(data)
  });
  let rp2 = await client.index({
    index: 'features',
    type: '_doc',
    body: JSON.stringify(data2)
  });
  let rp3 = await client.index({
    index: 'features',
    type: '_doc',
    body: JSON.stringify(data3)
  });
  let rp4 = await client.index({
    index: 'features',
    type: '_doc',
    body: JSON.stringify(data4)
  });


  res.redirect('/');
});
app.post('/postService', uploads.any(), async function (req, res) {

  var logoDark = "";
  var logoLight = "";
  var logoLight2 = "";
  var logoDark2 = "";
  var logoLight3 = "";
  var logoDark3 = "";
  for (var i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const targetPath = path.join(__dirname, "./views/images/services/" + req.files[i].originalname);
    fs.rename(tempPath, targetPath, err => {
      //    data.serviceDark= req.files[0].originalname;
    });
    if (req.files[i].fieldname == 'serviceDark') {
      logoDark = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'serviceLight') {
      logoLight = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'serviceDark2') {
      logoDark2 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'serviceLight2') {
      logoLight2 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'serviceDark3') {
      logoDark3 = req.files[i].originalname;
    } else if (req.files[i].fieldname == 'serviceLight3') {
      logoLight3 = req.files[i].originalname;
    }

  }
  if (logoLight == "") {
    logoLight = req.body.fll;
  }
  if (logoDark == '') {
    logoDark = req.body.fld;
  }
  if (logoLight2 == "") {
    logoLight2 = req.body.fll2;
  }
  if (logoDark2 == '') {
    logoDark2 = req.body.fld2;
  }
  if (logoLight3 == "") {
    logoLight3 = req.body.fll3;
  }
  if (logoDark3 == '') {
    logoDark3 = req.body.fld3;
  }
  var data = {
    "serviceTitle": req.body.serviceTitle1,
    "serviceContent": req.body.serviceContent1,
    "uid": req.body.urlId,
    "serviceLight": logoLight,
    "serviceDark": logoDark,
    "serviceId": "1"
  };
  var data2 = {
    "serviceTitle": req.body.serviceTitle2,
    "serviceContent": req.body.serviceContent2,
    "uid": req.body.urlId,
    "serviceLight": logoLight2,
    "serviceDark": logoDark2,
    "serviceId": "2"
  };
  var data3 = {
    "serviceTitle": req.body.serviceTitle3,
    "serviceContent": req.body.serviceContent3,
    "uid": req.body.urlId,
    "serviceLight": logoLight3,
    "serviceDark": logoDark3,
    "serviceId": "3"
  };

  let dl = await client.deleteByQuery({
    index: 'services',
    // type: 'posts',
    body: {
      query: {
        match: {
          "uid": req.body.urlId
        }
      }
    }
  });

  let clt = await client.index({
    index: 'services',
    type: '_doc',
    body: JSON.stringify(data)
  });
  let clt2 = await client.index({
    index: 'services',
    type: '_doc',
    body: JSON.stringify(data2)
  });
  let clt3 = await client.index({
    index: 'services',
    type: '_doc',
    body: JSON.stringify(data3)
  });
  res.redirect('/');
});
app.post('/postFooter', async function (req, res) {

  var data = {
    "footerTitle": req.body.footerTitle,
    "footerContent": req.body.footerContent,
    "uid": req.body.urlId,
    "footerCopyright": req.body.footerCopyright,
    "footerBottom": req.body.footerBottom
  };

  let response = await client.search({
    index: 'footercontent',
    type: '_doc',
    body: {
      query: {
        match: {
          "uid": req.body.urlId
        }
      },
    }
  });
  if (response.hits.total > 0) {
    let rp = await client.index({
      index: 'footercontent',
      id: response.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(data)
    });
    res.redirect('/');
  } else {
    let rp = await client.index({
      index: 'footercontent',
      //  id: responses.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(data)
    });
    res.redirect('/');
  }

});
app.post('/postNews', async function (req, res) {
  var datetime = new Date();
  var data = {
    "tickerTitle": req.body.newsTitle,
    "tickerContent": req.body.newsContent,
    "uid": req.body.urlId,
    "dateTimes": datetime.getFullYear() + "-" + datetime.getMonth() + "-" + datetime.getDate(),
    "isActive": "1"
  };

  let resp = await client.index({
    index: 'campaigntickers',
    //  id: responses.hits.hits[0]._id,
    type: '_doc',
    body: JSON.stringify(data)
  });
  res.redirect('/');
});
app.post('/saveExchange', async function (req, res) {
  var codes = req.body.codes;
  var exchangeName = req.body.exchangeName;
  var data = {
    "apiId": codes,
    "exchangeName": exchangeName
  };
  let resp = await client.index({
    index: 'exchanges',
    //  id: responses.hits.hits[0]._id,
    type: '_doc',
    body: JSON.stringify(data)
  });

  res.redirect('/');

});
app.get('/addExchange', function (req, res) {
  var options = {
    min: 0,
    max: 1000,
    integer: true
  }

  var rush = randomNumber(options);
  var options = {
    min: 1000,
    max: 10000,
    integer: true
  }

  rush = randomNumber(options) + "" + rush;

  res.render('newExchange', {
    codes: rush
  });
});
app.post('/sendingEmail', function (req, res) {
  var email = req.body.email;
  var name = req.body.names;
  var phone = req.body.phone;
  var msg = req.body.msg;

  var data = {
    from: 'postmaster@clarkhogan.com',
    to: 'hello@byzanti.ne',
    subject: 'Hello',
    text: "Name : " + name + " \n Email : " + email + " \n Phone : " + phone + "\n Message : " + msg
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) {
      res.json({
        'error': '1'
      });
    } else {
      res.json({
        'error': '0',
        'msg': body.message
      });
    }
  });


});
app.get('/exportJson/:id', (req, res) => {
  var apId = req.params.id;
  var data = {
    "url": "https://uberdex-admin.herokuapp.com",
    "apiId": apId
  };
  data = JSON.stringify(data);
  fs.writeFileSync('exports/app.json', data);
  var fileLocation = path.join('./exports', 'app.json');

  res.download(fileLocation, 'app.json');
});
app.post('/updatePassword', (req, res) => {
  let code = req.body.tokens;
  let password = req.body.password;
  client.search({
    index: 'tokens',
    type: '_doc',
    body: {
      query: {
        match: {
          "uid": "1"
        }
      },
    }
  }, function (error, response, status) {
    let p = response.hits.hits[0]._source.tokenNumber;
    if (p == code) {
      client.search({
        index: 'users',
        type: '_doc'
      }, function (error, responses, status) {
        let rp = responses.hits.hits[0]._source.username;
        let settings = {
          "username": rp,
          "password": password,
          "email": response.hits.hits[0]._source.email

        };

        client.index({
          index: 'users',
          id: responses.hits.hits[0]._id,
          type: '_doc',
          body: JSON.stringify(settings)
        }, function (err, resp, status) {
          res.redirect('/');
        });
      });
    } else {
      res.redirect('reset');
    }

  });
});
app.get('/reset', (req, res) => {


  res.render('reset');



});
app.post('/sendEmail', async function (req, res) {
  var email = req.body.userEmail;
  var options = {
    min: 0,
    max: 1000,
    integer: true
  }

  var rush = randomNumber(options);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jicstech8897@gmail.com',
      pass: 'jamil8897!'
    }
  });



  let response = await client.search({
    index: 'tokens',
    type: '_doc',
    body: {
      query: {
        match: {
          "uid": "1"
        }
      },
    }
  });
  let responses = await client.search({
    index: 'users',
    type: '_doc',
    body: {
      query: {
        match: {
          "email": email
        }
      },
    }
  });
  if (responses.hits.total > 0) {
    let emails = responses.hits.hits[0]._source.email;

    var mailOptions = {
      from: 'jicstech8897@gmail.com',
      to: email,
      subject: 'UberDex Reset Password Request',
      html: "Token Number is here " + rush
    };


    let settings = {
      "tokenNumber": rush,
      "uid": '1'

    };
    if (emails == email) {
      client.index({
        index: 'tokens',
        id: response.hits.hits[0]._id,
        type: '_doc',
        body: JSON.stringify(settings)
      }, function (err, resp, status) {
        console.log(err);
      });


      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.redirect('reset');
        } else {
          setTimeout(function () {
            res.redirect('/setPassword');
          }, 2000);

        }
      });
    } else {
      res.redirect('reset');
    }



  } else {
    res.render('reset');
  }







});
app.get('/setPassword', function (req, res) {
  res.render('password');
});
app.get('/getColors/:id', function (req, res) {

  var dts = {
    "logo": "",
    "companyName": "",
    "companyPhone": "",
    "companyEmail": "",
    "companyAddress": "",
    "companyDesc": "",
    "theme_color": "",
    "lightLogo": "",
    "footerTitle": "",
    "footerContent": "",
    "footerCopyright": "",
    "footerBottom": "",
    "error": "0"

  };
  client.search({
    index: 'profile',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, response, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      try {
        dts.companyName = response.hits.hits[0]._source.companyname;
        dts.companyAddress = response.hits.hits[0]._source.companyaddress;
        dts.companyPhone = response.hits.hits[0]._source.companynumber;
        dts.companyEmail = response.hits.hits[0]._source.companyemail;
        dts.companyDesc = response.hits.hits[0]._source.companydesc;
        client.search({
          index: 'settings',
          //type: 'constituencies',
          body: {
            query: {
              match: {
                "uid": req.params.id
              }
            },
          }
        }, function (error, response, status) {
          dts.logo = response.hits.hits[0]._source.logo;
          dts.theme_color = response.hits.hits[0]._source.theme_color;
          dts.lightLogo = response.hits.hits[0]._source.lightLogo;
          client.search({
            index: 'footercontent',
            //type: 'constituencies',
            body: {
              query: {
                match: {
                  "uid": req.params.id
                }
              },
            }
          }, function (error, response, status) {
            if (response.hits.total > 0) {
              dts.footerContent = response.hits.hits[0]._source.footerContent;
              dts.footerTitle = response.hits.hits[0]._source.footerTitle;
              dts.footerCopyright = response.hits.hits[0]._source.footerCopyright;
              dts.footerBottom = response.hits.hits[0]._source.footerBottom;

            }
            setTimeout(function () {
              res.json(dts);
            }, 2000);
          });

        });

      } catch (error) {
        res.json({
          'error': '1'
        });
      }
      //  console.log(response.hits.hits[0]._source);
      //  res.status(status).json(obj)

    }
  });


});

app.get('/getContents/:id', function (req, res) {
  var dts = {

    "trade": "",
    "aboutUs": "",
    "contactUs": "",
    "agreement": "",
    "contactUsTitle": "",
    "tradeTitle": "",
    "aboutUsTitle": "",
    "agreementTitle": "",
    "mainTitle": "",
    "mainContent": "",
    "error": "0"


  };
  client.search({
    index: 'contents',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, response, status) {
    if (error) {
      console.log("search error: " + error)
    } else {
      try {
        dts.trade = response.hits.hits[0]._source.trade;
        dts.contactUs = response.hits.hits[0]._source.contactUs;
        dts.aboutUs = response.hits.hits[0]._source.aboutUs;
        dts.agreement = response.hits.hits[0]._source.agreement;
        dts.agreement = response.hits.hits[0]._source.agreement;
        dts.tradeTitle = response.hits.hits[0]._source.tradeTitle;
        dts.contactUsTitle = response.hits.hits[0]._source.contactUsTitle;
        dts.aboutUsTitle = response.hits.hits[0]._source.aboutUsTitle;
        dts.agreementTitle = response.hits.hits[0]._source.agreementTitle;
        dts.mainTitle = response.hits.hits[0]._source.mainTitle;
        dts.mainContent = response.hits.hits[0]._source.mainContent;





        res.json(dts);
      } catch (error) {




        res.json({
          'error': '1'
        });
      }

    }
  });


});
app.get('/getNews/:id', function (req, res) {
  var tickers;
  client.search({
    index: 'campaigntickers',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      tickers = responses.hits;
      res.json(tickers);
    }
  });

});
app.get('/getServices/:id', function (req, res) {
  var tickers;
  client.search({
    index: 'services',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      tickers = responses.hits;
      res.json(tickers);
    }
  });

});
app.get('/getFeatures/:id', async function (req, res) {
  var tickers;
  client.search({
    index: 'features',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      tickers = responses.hits;
      res.json(tickers);
    }
  });

});
app.get('/appContent/:id', async function (req, res) {
  var contents = {
    "aboutUs": "",
    "agreement": "",
    "contactUs": "",
    "trade": "",
    "mainTitle": "",
    "mainContent": "",
    "uid": req.params.id
  };
  var footer = {
    "footerTitle": "",
    "footerContent": "",
    "footerCopyright": "",
    "footerBottom": ""
  };
  var tickers = {
    "hits": ""
  };
  var services = {
    "hits": ""
  };
  var features = {
    "hits": ""
  };
  client.search({
    index: 'contents',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, response, status) {
    if (error) {
      console.log("search error: " + error)
    } else {
      try {
        contents.aboutUs = response.hits.hits[0]._source.aboutUs;
        contents.contactUs = response.hits.hits[0]._source.contactUs;
        contents.trade = response.hits.hits[0]._source.trade;
        contents.agreement = response.hits.hits[0]._source.agreement;
        contents.tradeTitle = response.hits.hits[0]._source.tradeTitle;
        contents.contactUsTitle = response.hits.hits[0]._source.contactUsTitle;
        contents.aboutUsTitle = response.hits.hits[0]._source.aboutUsTitle;
        contents.agreementTitle = response.hits.hits[0]._source.agreementTitle;
        contents.mainTitle = response.hits.hits[0]._source.mainTitle;
        contents.mainContent = response.hits.hits[0]._source.mainContent;
        contents.uid = response.hits.hits[0]._source.uid;


      } catch (error) {
        contents.uid = req.params.id;


      }
    }
  });

  client.search({
    index: 'campaigntickers',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      tickers = responses.hits;
    }
  });
  client.search({
    index: 'footercontent',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error);
    } else {
      if (responses.hits.total > 0) {
        footer.footerTitle = responses.hits.hits[0]._source.footerTitle;
        footer.footerContent = responses.hits.hits[0]._source.footerContent;
        footer.footerCopyright = responses.hits.hits[0]._source.footerCopyright;
        footer.footerBottom = responses.hits.hits[0]._source.footerBottom;

      }

    }
  });
  client.search({
    index: 'services',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      services = responses.hits;

    }
  });
  console.log(services);
  client.search({
    index: 'features',
    body: {
      query: {
        match: {
          "uid": req.params.id
        }
      },
    }
  }, function (error, responses, status) {
    if (error) {
      console.log("search error: " + error)
    } else {

      features = responses.hits;

    }
  });

  setTimeout(function () {

    res.render('pageContent', {
      data: contents,
      ticker: tickers,
      footer: footer,
      services: services,
      features: features
    });

  }, 6000);

});
app.post('/postContent', async function (req, res) {

  let contactUs = req.body.contactUs;
  let aboutUs = req.body.aboutUs;
  let agreement = req.body.agreement;
  let trade = req.body.trade;
  let contactUsTitle = req.body.contactUsTitle;
  let aboutUsTitle = req.body.aboutUsTitle;
  let agreementTitle = req.body.agreementTitle;
  let tradeTitle = req.body.tradeTitle;
  let mainTitle = req.body.mainTitle;
  let mainContent = req.body.mainContent;
  let urlId = req.body.urlId;
  sess = req.session;


  let response = await client.search({
    index: 'contents',
    type: '_doc',
    body: {
      query: {
        match: {
          "uid": urlId
        }
      },
    }
  });



  let settings = {
    "contactUs": contactUs,
    "trade": trade,
    "aboutUs": aboutUs,
    "agreement": agreement,
    "contactUsTitle": contactUsTitle,
    "tradeTitle": tradeTitle,
    "aboutUsTitle": aboutUsTitle,
    "agreementTitle": agreementTitle,
    "mainTitle": mainTitle,
    "mainContent": mainContent,
    "uid": urlId

  };
  if (response.hits.total > 0) {
    client.index({
      index: 'contents',
      id: response.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });

  } else {
    client.index({
      index: 'contents',
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });

  }

  res.redirect('/appContent/' + urlId);


});
app.post('/saveLogo', upload.any(), async function (req, res) {
  sess = req.session;
  var companyName = req.body.companyName;
  var companyAddress = req.body.companyAddress;
  var companyNumber = req.body.companyPhone;
  var companyEmail = req.body.companyEmail;
  var companyDes = req.body.description;
  var takerFee = req.body.takerFee;
  var makerFee = req.body.makerFee;
  var urlId = req.body.urlId;
  var logo0 = "";
  var logo1 = "";
  var color = '';
  for (var i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const targetPath = path.join(__dirname, "./views/images/byzantine/" + req.files[i].originalname);
    fs.rename(tempPath, targetPath, err => {

    });
    if (i == 0) {
      logo0 = req.files[i].originalname;
    }
    if (i == 1) {
      logo1 = req.files[i].originalname;
    }
  }

  let check = 0;
  let response = await client.search({
    index: 'settings',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": urlId
        }
      },
    }
  });
  if (response.hits.total > 0) {
    color = response.hits.hits[0]._source.theme_color;

  }
  let settings = {
    "theme_color": color,
    "logo": logo0,
    "lightLogo": logo1,
    "uid": urlId

  };

  if (response.hits.total > 0) {
    client.index({
      index: 'settings',
      id: response.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });
  } else {
    client.index({
      index: 'settings',
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });
  }


  let rsp = await client.search({
    index: 'profile',
    //type: 'constituencies',
    body: {
      query: {
        match: {
          "uid": urlId
        }
      },
    }
  });

  let profile = {
    "companyname": companyName,
    "companyaddress": companyAddress,
    "companynumber": companyNumber,
    "companyemail": companyEmail,
    "companydesc": companyDes,
    "takerfee": takerFee,
    "makerfee": makerFee,
    "uid": urlId

  };

  if (rsp.hits.total > 0) {
    client.index({
      index: 'profile',
      id: rsp.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(profile)
    }, function (err, resp, status) {
      console.log(err);
    });
  } else {
    client.index({
      index: 'profile',
      type: '_doc',
      body: JSON.stringify(profile)
    }, function (err, resp, status) {
      console.log(err);
    });
  }

  res.redirect('/appLogo/' + urlId);


});
app.get('/admin', async function (req, res) {
  sess = req.session;

  if (sess.uid) {
    var options = {
      min: 0,
      max: 1000,
      integer: true
    }

    const exchangesResponse = await fetch('https://api.byzanti.ne/exchanges?api_key=FQK0SYR-W4H4NP2-HXZ2PKH-3J8797N');
    const exchangesJSON = await exchangesResponse.json();
    console.log(exchangesJSON);

    // .then(data => {
    //   data.forEach(function (v, i) {
    //     client.search({
    //       index: 'exchanges',
    //       type: '_doc',
    //       body: {
    //         query: {
    //           match: {
    //             "exchangeName": v.name
    //           }
    //         },
    //       }
    //     }, function (error, response, status) {
    //       if (response.hits.total == 0) {


    //         let rush = randomNumber(options);
    //         let data = {
    //           "apiId": rush,
    //           "exchangeName": v.name
    //         };
    //         client.index({
    //           index: 'exchanges',
    //           //  id: responses.hits.hits[0]._id,
    //           type: '_doc',
    //           body: JSON.stringify(data)
    //         });
    //       }
    //     });
    //   });
    // });

    // let resp = await client.search({
    //   index: 'exchanges',
    //   type: '_doc',
    // });

    //try setting a global data?
    // this.setState({data: exchangesJSON});

    res.render('admin', {
      data: exchangesJSON
    });

  } else {
    res.redirect('/');
  }
});

app.get('/appLogo/:id', async function (req, res) {
  sess = req.session;
  var urlId = req.params.id;

  if (urlId) {
    var dts = {
      "logo": "",
      "companyName": "",
      "companyPhone": "",
      "companyEmail": "",
      "companyAddress": "",
      "companyDesc": "",
      "takerfee": "",
      "makerfee": "",
      "lightLogo": "",
      "uid": urlId

    };
    let response = await client.search({
      index: 'profile',
      //type: 'constituencies',
      body: {
        query: {
          match: {
            "uid": urlId
          }
        },
      }
    });
    if (response.hits.total > 0) {
      dts.companyName = response.hits.hits[0]._source.companyname;
      dts.companyAddress = response.hits.hits[0]._source.companyaddress;
      dts.companyPhone = response.hits.hits[0]._source.companynumber;
      dts.companyEmail = response.hits.hits[0]._source.companyemail;
      dts.companyDesc = response.hits.hits[0]._source.companydesc;
      dts.takerfee = response.hits.hits[0]._source.takerfee;
      dts.makerfee = response.hits.hits[0]._source.makerfee;
    }

    let responses = await client.search({
      index: 'settings',
      //type: 'constituencies',
      body: {
        query: {
          match: {
            "uid": urlId
          }
        },
      }
    });
    if (responses.hits.total > 0) {
      dts.logo = responses.hits.hits[0]._source.logo;
      dts.lightLogo = responses.hits.hits[0]._source.lightLogo;
      dts.uid = urlId;
    }

    res.render('appLogo', {
      data: dts
    });

  } else {
    res.redirect('/');
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });

});
app.post('/saveColor', async function (req, res) {

  let color = req.body.color;
  let urlId = req.body.urlId;
  sess = req.session;

  let logo = '';
  let lightLogo = '';
  let response = await client.search({
    index: 'settings',
    type: '_doc',
    body: {
      query: {
        match: {
          "uid": urlId
        }
      },
    }
  });

  logo = response.hits.hits[0]._source.logo;
  lightLogo = response.hits.hits[0]._source.lightLogo;
  let settings = {
    "theme_color": color,
    "logo": logo,
    "lightLogo": lightLogo,
    "uid": urlId

  };
  let data = JSON.stringify(settings);


  if (response.hits.total > 0) {
    let rp = await client.index({
      index: 'settings',
      id: response.hits.hits[0]._id,
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });
  } else {
    let rp = await client.index({
      index: 'settings',
      type: '_doc',
      body: JSON.stringify(settings)
    }, function (err, resp, status) {
      console.log(err);
    });
  }

  res.redirect('/appColor/' + urlId);




});
app.get('/appColor/:id', function (req, res) {
  var urlId = req.params.id;

  if (urlId) {
    res.render('appColor', {
      uid: urlId
    });

    // res.render('appColor');
  } else {
    res.redirect('/');
  }
});
app.post('/login', (req, res) => {
  sess = req.session;
  if (sess.uid) {
    res.redirect('/admin');
  }
  let username = req.body.user_name;
  let password = req.body.password;
  client.search({
    index: 'users',
    // type: 'posts',
    body: {
      query: {
        match: {
          "username": username
        },
        match: {
          "password": password
        }
      }
    }
  }).then(function (resp) {
    /* */

    if (resp.hits.total > 0) {
      sess.uid = resp.hits.hits[0]._id;
      res.redirect('/admin');
      console.log(resp.hits.hits[0]._source);
    } else {
      res.redirect('/');
    }
  }, function (err) {
    res.redirect('/');
    //console.trace(err.message); 
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("server running on port " + port));