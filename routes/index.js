console.log("Start of index.js");

var express = require('express');
var router = express.Router();
var database = require("../ServerJavascripts/database");
const sgMail = require('@sendgrid/mail');

/* GET home page. */
// / is the endpoint
router.get('/', function (req, res, next) {
    res.render('index', {"username": req.cookies["username"]});
    res.end();
});

router.get("/register", function (req, res, next) {
    let username = req.cookies["username"];
    // if already logged in, just go to list
    if(username == undefined)
    {
        res.render("register", {message: ""});
        res.end();
    }
    else
    {
        res.redirect("/mylist");
    }
});

router.post("/register", function (req, res, next) {
    console.log("Register body: " + req.body.username);
    database.checkUsernameExists(req.body.username, function (exist) {
        // if have duplicate username
        if (exist) {
            res.render("register", {message: "Username exists!"});
        }
        // if have unique username
        else {
            // success
            // adds info to database
            database.addToLoginTable(req.body.name, req.body.email, req.body.username, req.body.password);
            // saves username in cookie
            res.cookie("username", req.body.username);
            // redirects page
            res.redirect("/mylist");
        }
        res.end();
    });
});

router.get("/signin", function (req, res, next) {
    let username = req.cookies["username"];
    if(username == undefined)
    {
        res.render("signin", {message: ""});
        res.end();
    }
    else
    {
        res.redirect("/mylist");
    }
});

router.post("/signin", function (req, res, next) {
    console.log("SIGN IN!");
    database.checkUsernameExists(req.body.username, function (exist) {
        console.log("Sign in user valid: " + exist);
        // if username is valid
        if (exist) {
            database.checkPasswordMatchesUsername(req.body.username, req.body.password, function (match) {
                console.log("Sign in pass valid: " + match);
                // is password match username
                if (match) {
                    // success
                    // saves username in cookie
                    res.cookie("username", req.body.username);
                    // redirects page
                    res.redirect("/mylist");
                }
                // invalid password
                else {
                    res.render("signin", {message: "Invalid Username or Password!"});
                    res.end();
                }
            });
        }
        // invalid username
        else {
            res.render("signin", {message: "Invalid Username or Password!"});
            res.end();
        }
    });
});

router.get("/json", function (req, res, next) {
    database.getAllLogin(function (record) {
        let json = {};
        record.forEach(entry => {
            json[entry.id] = {
                "name": entry.name,
                "email": entry.email,
                "username": entry.username,
                "password": entry.password
            };
        });
        res.json(json);
        res.end();
    });
});

router.get("/expose", function (req, res, next){
    database.getAllLogin(function (record) {
        res.render('success', {
            record: record
        });
        res.end();
    });
});

router.get("/profile", function(req, res, next){
   let username = req.cookies["username"];
   if(username != undefined)
   {
       database.getUserInfo(username, function (userRecord) {
           res.render("profile", userRecord);
           res.end();
       });
   }
   else
   {
       res.redirect("/signin");
   }
});

router.get("/mylist", function(req, res, next){
    console.log("MY LIST!!");
    let username = req.cookies["username"];
    if(username != undefined)
    {
        database.getAllActivityForUser(false, username, function (todoList) {
            database.getAllActivityForUser(true, username, function (completeList) {
                res.render("mylist", {todoList: todoList, completeList: completeList});
                res.end();
            })
        })
    }
    else
    {
        res.redirect("/signin");
    }
});

router.post("/createActivity", function (req, res, next) {
    let username = req.cookies["username"];
    // adds to incomplete table
    database.addToActivityTable(false, username, req.body.activity, function () {
        res.send(`Created activity ${req.body.activity} for ${username}`);
    });
});

router.post("/checkTodo", function(req, res, next){
    let username = req.cookies["username"];
    // removes from todo
    database.removeFromActivityTable(false, username, req.body.activity, function () {
        // add to complete
        database.addToActivityTable(true, username, req.body.activity, function () {
            res.send("Checked off " + req.body.activity + " from " + username)
        });
    });
});

router.delete("/deleteTodo", function(req, res, next){
    let username = req.cookies["username"];
    database.removeFromActivityTable(false, username, req.body.activity, function () {
       res.send("Deleted " + req.body.activity + " from " + username);
    });
});

router.delete("/deleteComplete", function(req, res, next){
    let username = req.cookies["username"];
    database.removeFromActivityTable(true, username, req.body.activity, function () {
        res.send("Deleted " + req.body.activity + " from " + username);
    });});

router.get("/signout", function (req, res, next){
    res.cookie("username", "", {maxAge: -1000});
    res.redirect("/");
});

router.get("/email", function(req, res, next){
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
        to: 'aaroc11@uci.edu',
        from: 'apkirito1@gmail.com',
        subject: 'Hello from Todo',
        text: "hehexd"
    };
    sgMail.send(msg);
});

module.exports = router;

console.log("End of index.js");