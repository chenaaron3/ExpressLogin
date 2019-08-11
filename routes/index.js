console.log("Start of index.js");

var express = require('express');
var router = express.Router();
var database = require("../public/javascripts/database");

/* GET home page. */
// / is the endpoint
router.get('/', function(req, res, next) {
  res.render('index');
  res.end();
});

router.post("/", function(req, res, next)
{
  database.addToLoginTable(req.body.name, req.body.username, req.body.password);
  console.log(req.body);
  database.getAllLogin(function(record){
    res.render('success', { name:req.body.name, username:req.body.username, password:req.body.password, record:record});
    res.end();
  });
});

router.get("/register", function(req, res, next)
{
  res.render("register");
  res.end();
});

module.exports = router;

console.log("End of index.js");