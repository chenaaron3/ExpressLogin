var mysql = require("mysql");

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timeout: 15000
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!")
});

function addToDatabase(name, username, password)
{
    var sql = `INSERT INTO login(name, username, password) VALUES("${name}" ,"${username}" ,"${password}")`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted: " + sql);
    });
}

function getAllLogin(callback)
{
    con.query("SELECT DISTINCT name, username, password FROM login", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        callback(result);
    });
}

module.exports.addToDatabase = addToDatabase;
module.exports.getAllLogin = getAllLogin;
