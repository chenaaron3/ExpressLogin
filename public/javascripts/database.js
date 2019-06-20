var mysql = require("mysql");
const table = "login";

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timeout: 60000
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!")
    checkIfTableExists();
});


function checkIfTableExists()
{
    con.query(`SHOW TABLES LIKE '${table}'`, function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0)
        {
            console.log("Table exists!");
        }
        else
        {
            console.log("Table does not exist!");
            var sql = `CREATE TABLE ${table}(id int AUTO_INCREMENT, name varchar(30) NOT NULL, username varchar(30) NOT NULL, 
                password varchar(30) NOT NULL, PRIMARY KEY(id))`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Table created!");
            });
        }
    });
}

function deleteTable(name)
{
    con.query(`DROP TABLE ${name}`, function(err, result){
       if (err)
       {
           console.log(name + " does not exist!");
       }
       else
       {
           console.log("Deleted Table: " + name);
       }
    });
}

function addToDatabase(name, username, password)
{
    var sql = `INSERT INTO ${table}(name, username, password) VALUES("${name}" ,"${username}" ,"${password}")`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted: " + sql);
    });
}

function getAllLogin(callback)
{
    con.query(`SELECT DISTINCT name, username, password FROM ${table}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        callback(result);
    });
}

module.exports.addToDatabase = addToDatabase;
module.exports.getAllLogin = getAllLogin;
