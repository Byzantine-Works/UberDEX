"use strict";
const express = require("express");
var cors = require("cors");
const app = express();
//support@uberDexinc.com
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
var fs = require("fs");
var nodemailer = require("nodemailer");
var randomNumber = require("random-number");

app.set("view engine", "ejs");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const multer = require("multer");
const upload = multer({
  dest: "views/images/byzantine"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});
var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
  hosts: [
    "https://elastic:4u0YmtujJihkMxDlhuOoa2ai@37974b05ffd14537b88eaa6899c408aa.us-central1.gcp.cloud.es.io:9243"
  ]
});
app.use(
  session({ secret: "jamil@active", resave: false, saveUninitialized: true })
);

app.options("*", cors());
app.use(cors());
app.use(express.static(__dirname + "/views"));
var sess = { uid: "" };
app.get("/", (req, res) => {
  sess = req.session;
  if (sess.uid) {
    res.redirect("/admin");
  } else {
    res.render("login");
  }
});
app.post("/updatePassword", (req, res) => {
  let code = req.body.tokens;
  let password = req.body.password;
  client.search(
    {
      index: "tokens",
      type: "_doc",
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      let p = response.hits.hits[0]._source.tokenNumber;
      if (p == code) {
        client.search(
          {
            index: "users",
            type: "_doc"
          },
          function(error, responses, status) {
            let rp = responses.hits.hits[0]._source.username;
            let settings = {
              username: rp,
              password: password
            };

            client.index(
              {
                index: "users",
                id: responses.hits.hits[0]._id,
                type: "_doc",
                body: JSON.stringify(settings)
              },
              function(err, resp, status) {
                res.redirect("/");
              }
            );
          }
        );
      } else {
        res.redirect("reset");
      }
    }
  );
});
app.get("/reset", (req, res) => {
  res.render("reset");
});
app.post("/sendEmail", (req, res) => {
  var email = req.body.userEmail;
  var options = {
    min: 0,
    max: 1000,
    integer: true
  };

  var rush = randomNumber(options);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abcht@gmail.com",
      pass: "jamil1234"
    }
  });

  client.search(
    {
      index: "tokens",
      type: "_doc",
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        res.redirect("reset");
      } else {
        client.search(
          {
            index: "profile",
            type: "_doc",
            body: {
              query: {
                match: { uid: "1" }
              }
            }
          },
          function(error, responses, status) {
            let emails = responses.hits.hits[0]._source.companyemail;
            if (emails == email) {
              var mailOptions = {
                from: "jicstech8897@gmail.com",
                to: email,
                subject: "UberDex Reset Password Request",
                html: "Token Number is here " + rush
              };

              let settings = {
                tokenNumber: rush,
                uid: "1"
              };

              client.index(
                {
                  index: "tokens",
                  id: response.hits.hits[0]._id,
                  type: "_doc",
                  body: JSON.stringify(settings)
                },
                function(err, resp, status) {
                  console.log(err);
                }
              );

              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  res.redirect("reset");
                } else {
                  setTimeout(function() {
                    res.redirect("/setPassword");
                  }, 2000);
                }
              });
            } else {
              res.render("reset");
            }
          }
        );

        //fs.writeFileSync('client/src/app.json', data);
      }
    }
  );
});
app.get("/setPassword", function(req, res) {
  res.render("password");
});
app.get("/getColors", function(req, res) {
  var dts = {
    logo: "",
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    companyAddress: "",
    companyDesc: "",
    theme_color: ""
  };
  client.search(
    {
      index: "profile",
      //type: 'constituencies',
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
        dts.companyName = response.hits.hits[0]._source.companyname;
        dts.companyAddress = response.hits.hits[0]._source.companyaddress;
        dts.companyPhone = response.hits.hits[0]._source.companynumber;
        dts.companyEmail = response.hits.hits[0]._source.companyemail;
        dts.companyDesc = response.hits.hits[0]._source.companydesc;
        client.search(
          {
            index: "settings",
            //type: 'constituencies',
            body: {
              query: {
                match: { uid: "1" }
              }
            }
          },
          function(error, response, status) {
            dts.logo = response.hits.hits[0]._source.logo;
            dts.theme_color = response.hits.hits[0]._source.theme_color;

            res.json(dts);
          }
        );
        //  console.log(response.hits.hits[0]._source);
        //  res.status(status).json(obj)
      }
    }
  );
});

app.get("/getContents", function(req, res) {
  var dts = {
    trade: "",
    aboutUs: "",
    contactUs: "",
    agreement: "",
    contactUsTitle: "",
    tradeTitle: "",
    aboutUsTitle: "",
    agreementTitle: "",
    mainTitle: "",
    mainContent: ""
  };
  client.search(
    {
      index: "contents",
      //type: 'constituencies',
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
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
      }
    }
  );
});

app.get("/appContent", function(req, res) {
  var contents = {
    aboutUs: "",
    agreement: "",
    contactUs: "",
    trade: "",
    mainTitle: "",
    mainContent: ""
  };
  client.search(
    {
      index: "contents",
      //type: 'constituencies',
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
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

        res.render("pageContent", { data: contents });
      }
    }
  );
});
app.post("/postContent", function(req, res) {
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
  sess = req.session;

  client.search(
    {
      index: "contents",
      type: "_doc",
      body: {
        query: {
          match: { uid: "1" }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
        let settings = {
          contactUs: contactUs,
          trade: trade,
          aboutUs: aboutUs,
          agreement: agreement,
          contactUsTitle: contactUsTitle,
          tradeTitle: tradeTitle,
          aboutUsTitle: aboutUsTitle,
          agreementTitle: agreementTitle,
          mainTitle: mainTitle,
          mainContent: mainContent,
          uid: "1"
        };

        client.index(
          {
            index: "contents",
            id: response.hits.hits[0]._id,
            type: "_doc",
            body: JSON.stringify(settings)
          },
          function(err, resp, status) {
            console.log(err);
          }
        );

        //fs.writeFileSync('client/src/app.json', data);
        setTimeout(function() {
          res.redirect("/appContent");
        }, 2000);
      }
    }
  );
});
app.post("/saveLogo", upload.single("logo"), function(req, res) {
  sess = req.session;
  var companyName = req.body.companyName;
  var companyAddress = req.body.companyAddress;
  var companyNumber = req.body.companyPhone;
  var companyEmail = req.body.companyEmail;
  var companyDes = req.body.description;
  var takerFee = req.body.takerFee;
  var makerFee = req.body.makerFee;
  try {
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      "./views/images/byzantine/" + req.file.originalname
    );
    var color = "";
    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        //  if (err) {console.log(err);}
        let check = 0;
        client.search(
          {
            index: "settings",
            //type: 'constituencies',
            body: {
              query: {
                match: { uid: sess.uid }
              }
            }
          },
          function(error, response, status) {
            if (error) {
              console.log("search error: " + error);
            } else {
              color = response.hits.hits[0]._source.theme_color;
              let settings = {
                theme_color: color,
                logo: req.file.originalname,
                uid: sess.uid
              };

              client.index(
                {
                  index: "settings",
                  id: response.hits.hits[0]._id,
                  type: "_doc",
                  body: JSON.stringify(settings)
                },
                function(err, resp, status) {
                  console.log(err);
                }
              );
            }
          }
        );
      });

      client.search(
        {
          index: "profile",
          //type: 'constituencies',
          body: {
            query: {
              match: { uid: sess.uid }
            }
          }
        },
        function(error, response, status) {
          if (error) {
            console.log("search error: " + error);
          } else {
            let profile = {
              companyname: companyName,
              companyaddress: companyAddress,
              companynumber: companyNumber,
              companyemail: companyEmail,
              companydesc: companyDes,
              takerfee: takerFee,
              makerfee: makerFee,
              uid: sess.uid
            };

            client.index(
              {
                index: "profile",
                id: response.hits.hits[0]._id,
                type: "_doc",
                body: JSON.stringify(profile)
              },
              function(err, resp, status) {
                console.log(err);
              }
            );
          }
        }
      );

      setTimeout(function() {
        res.redirect("/appLogo");
      }, 3000);
    }
  } catch (err) {
    client.search(
      {
        index: "profile",
        //type: 'constituencies',
        body: {
          query: {
            match: { uid: sess.uid }
          }
        }
      },
      function(error, response, status) {
        if (error) {
          console.log("search error: " + error);
        } else {
          let profile = {
            companyname: companyName,
            companyaddress: companyAddress,
            companynumber: companyNumber,
            companyemail: companyEmail,
            companydesc: companyDes,
            takerfee: takerFee,
            makerfee: makerFee,

            uid: sess.uid
          };

          client.index(
            {
              index: "profile",
              id: response.hits.hits[0]._id,
              type: "_doc",
              body: JSON.stringify(profile)
            },
            function(err, resp, status) {
              console.log(err);
            }
          );
        }
      }
    );

    setTimeout(function() {
      res.redirect("/appLogo");
    }, 3000);
  }

  //  res.redirect('/admin');
});
app.get("/admin", function(req, res) {
  sess = req.session;

  if (sess.uid) {
    res.render("admin");
  } else {
    res.redirect("/");
  }
});
app.get("/appLogo", function(req, res) {
  sess = req.session;

  if (sess.uid) {
    var dts = {
      logo: "",
      companyName: "",
      companyPhone: "",
      companyEmail: "",
      companyAddress: "",
      companyDesc: "",
      takerfee: "",
      makerfee: ""
    };
    client.search(
      {
        index: "profile",
        //type: 'constituencies',
        body: {
          query: {
            match: { uid: sess.uid }
          }
        }
      },
      function(error, response, status) {
        if (error) {
          console.log("search error: " + error);
        } else {
          dts.companyName = response.hits.hits[0]._source.companyname;
          dts.companyAddress = response.hits.hits[0]._source.companyaddress;
          dts.companyPhone = response.hits.hits[0]._source.companynumber;
          dts.companyEmail = response.hits.hits[0]._source.companyemail;
          dts.companyDesc = response.hits.hits[0]._source.companydesc;
          dts.takerfee = response.hits.hits[0]._source.takerfee;
          dts.makerfee = response.hits.hits[0]._source.makerfee;

          client.search(
            {
              index: "settings",
              //type: 'constituencies',
              body: {
                query: {
                  match: { uid: sess.uid }
                }
              }
            },
            function(error, response, status) {
              dts.logo = response.hits.hits[0]._source.logo;
              res.render("appLogo", { data: dts });
            }
          );
          //  console.log(response.hits.hits[0]._source);
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
app.post("/saveColor", function(req, res) {
  let color = req.body.color;
  sess = req.session;

  let logo = "";

  client.search(
    {
      index: "settings",
      type: "_doc",
      body: {
        query: {
          match: { uid: sess.uid }
        }
      }
    },
    function(error, response, status) {
      if (error) {
        console.log("search error: " + error);
      } else {
        logo = response.hits.hits[0]._source.logo;
        console.log(response.hits.hits[0]._source);
        let settings = {
          theme_color: color,
          logo: logo,
          uid: sess.uid
        };
        let data = JSON.stringify(settings);

        client.index(
          {
            index: "settings",
            id: response.hits.hits[0]._id,
            type: "_doc",
            body: JSON.stringify(settings)
          },
          function(err, resp, status) {
            console.log(err);
          }
        );

        //fs.writeFileSync('client/src/app.json', data);
        res.redirect("/appColor");
      }
    }
  );
});
app.get("/appColor", function(req, res) {
  sess = req.session;

  if (sess.uid) {
    res.render("appColor");
  } else {
    res.redirect("/");
  }
});
app.post("/login", (req, res) => {
  sess = req.session;
  if (sess.uid) {
    res.redirect("/admin");
  }
  let username = req.body.user_name;
  let password = req.body.password;
  client
    .search({
      index: "users",
      // type: 'posts',
      body: {
        query: {
          match: {
            username: username
          },
          match: {
            password: password
          }
        }
      }
    })
    .then(
      function(resp) {
        /* */
        console.log("hi");
        if (resp.hits.total > 0) {
          sess.uid = resp.hits.hits[0]._id;
          res.redirect("/admin");
          console.log(resp.hits.hits[0]._source);
        } else {
          res.redirect("/");
        }
      },
      function(err) {
        res.redirect("/");
        //console.trace(err.message);
      }
    );
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log("server running on port " + port));
