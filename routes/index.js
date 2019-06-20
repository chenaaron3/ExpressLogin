var express = require('express');
var router = express.Router();
var database = require("../public/javascripts/database");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  res.end();
});

router.post("/", function(req, res, next)
{
  database.addToDatabase(req.body.name, req.body.username, req.body.password);
  console.log(req.body);
  database.getAllLogin(function(record){
    res.render('success', { name:req.body.name, username:req.body.username, password:req.body.password, record:record});
    res.end();
  });
});

module.exports = router;
