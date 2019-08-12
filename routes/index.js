console.log("Start of index.js");

var express = require('express');
var router = express.Router();
var database = require("../ServerJavascripts/database");

/* GET home page. */
// / is the endpoint
router.get('/', function (req, res, next) {
    res.render('index', {"username": req.cookies["username"]});
    res.end();
});

router.post("/", function (req, res, next) {
    database.addToLoginTable(req.body.name, req.body.email, req.body.username, req.body.password);
    console.log(req.body);
    database.getAllLogin(function (record) {
        res.cookie("username", req.body.username);
        res.render('success', {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            record: record
        });
        res.end();
    });
});

router.get("/register", function (req, res, next) {
    res.render("register");
    res.end();
});

router.get("/json", function (req, res, next) {
    database.getAllLogin(function (record) {
        let json = {};
        record.forEach(entry => {
           json[entry.id] = {"name": entry.name, "email": entry.email, "username": entry.username, "password": entry.password};
        });
        res.json(json);
        res.end();
    });
});

module.exports = router;

console.log("End of index.js");