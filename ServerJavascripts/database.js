console.log("Start of database.js");

var mysql = require("mysql");
const loginTable = "login";
const imageTable = "image";
const todoTable = "todo";
const completeTable = "complete";

var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timeout: 60000
};
var con = mysql.createConnection(config);

con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!")
    console.log("Clear Login: " + process.env.CLEAR_LOGIN);
    console.log("Clear Image: " + process.env.CLEAR_IMAGE);
    console.log("Clear Todo: " + process.env.CLEAR_TODO);
    console.log("Clear Complete: " + process.env.CLEAR_Complete);
    if (process.env.CLEAR_LOGIN === "true") {
        deleteTable(loginTable);
    }
    if (process.env.CLEAR_IMAGE === "true") {
        deleteTable(imageTable);
    }
    if (process.env.CLEAR_TODO === "true") {
        deleteTable(todoTable);
    }
    if (process.env.CLEAR_COMPLETE === "true") {
        deleteTable(completeTable);
    }
    checkIfTableExists(loginTable);
    checkIfTableExists(imageTable);
    checkIfTableExists(todoTable);
    checkIfTableExists(completeTable);
});
// handles the first time the connection is lost
con.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
    }
});

function handleDisconnect() {
    console.log("Attempting to reconnect...");
    con = mysql.createConnection(config); // Recreate the connection, since
    // the old one cannot be reused.

    con.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

function checkIfTableExists(name) {
    con.query(`SHOW TABLES LIKE '${name}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            console.log(`Table ${name} exists!`);
        } else {
            console.log(`Table ${name} does not exist!`);
            if (name == loginTable) {
                createLoginTable();
            } else if (name == imageTable) {
                createImageTable();
            } else if (name == todoTable) {
                createActivityTable(false);
            }else if (name == completeTable) {
                createActivityTable(true);
            }
        }
    });
}

function deleteTable(name) {
    con.query(`DROP TABLE ${name}`, function (err, result, fields) {
        if (err) {
            console.log(name + " does not exist!");
        } else {
            console.log("Deleted Table: " + name);
        }
    });
}

// LOGIN TABLE
function createLoginTable() {
    var sql = `CREATE TABLE ${loginTable}(id int AUTO_INCREMENT, name varchar(30) NOT NULL, email varchar(30) NOT NULL,
                username varchar(30) NOT NULL, password varchar(30) NOT NULL, PRIMARY KEY(id))`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Created Login Table!");
    });
}

function addToLoginTable(name, email, username, password) {
    var sql = `INSERT INTO ${loginTable}(name, email, username, password) VALUES("${name}", "${email}" 
            ,"${username}" ,"${password}")`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted: " + sql);
    });
}

function getAllLogin(callback) {
    con.query(`SELECT DISTINCT id, name, email, username, password FROM ${loginTable}`, function (err, result, fields) {
        if (err) throw err;
        console.log("Login Results: " + result);
        callback(result);
    });
}

// IMAGE TABLE
function createImageTable() {
    var sql = `CREATE TABLE ${imageTable}(id int AUTO_INCREMENT, file mediumtext NOT NULL, PRIMARY KEY(id))`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("Created Image Table!");
    });
}

function addToImageTable(blob) {
    var sql = `INSERT INTO ${imageTable}(file) VALUES ("${blob}")`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("Inserted blob!");
    });
}

function getAllImages(callback) {
    var sql = `SELECT file FROM ${imageTable}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("Images Results: " + result);
        callback(result);
    });
}

// ACTIVITY TABLE
function createActivityTable(complete) {
    let table = complete? completeTable : todoTable;
    var sql = `CREATE TABLE ${table}(id int AUTO_INCREMENT, username varchar(30) NOT NULL,
                activity varchar(50), PRIMARY KEY(id))`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(`Created ${table} Table!`);
    });
}

function addToActivityTable(complete, username, activity, callback) {
    let table = complete? completeTable : todoTable;
    var sql = `INSERT INTO ${table}(username, activity) VALUES ("${username}", "${activity}")`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(`Inserted activity into ${table}!`);
        callback();
    });
}

function removeFromActivityTable(complete, username, activity, callback) {
    let table = complete? completeTable : todoTable;
    var sql = `DELETE FROM ${table} WHERE username = "${username}" AND activity = "${activity}"`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(`Deleted ${activity} from ${table}!`);
        callback();
    });
}

// returns list of json activities
function getAllActivityForUser(complete, username, callback) {
    let table = complete? completeTable : todoTable;
    var sql = `SELECT * FROM ${table} WHERE username = "${username}"`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

// Queries
function checkUsernameExists(user, callback) {
    var sql = `SELECT COUNT(username) FROM ${loginTable} WHERE username = "${user}"`
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        let count = result[0]["COUNT(username)"];
        console.log("Checking " + user + " " + count);
        callback(count != 0);
    });
}

function checkPasswordMatchesUsername(user, pass, callback) {
    var sql = `SELECT COUNT(*) FROM ${loginTable} WHERE username = "${user}" AND password = "${pass}"`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        let count = result[0]["COUNT(*)"];
        console.log("Valid user and password: " + (count != 0));
        callback(count != 0);
    });
}

function getUserInfo(user, callback) {
    var sql = `SELECT * FROM ${loginTable} WHERE username = "${user}"`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result[0]);
    });
}


module.exports = {
    addToLoginTable: addToLoginTable,
    getAllLogin: getAllLogin,
    addToImageTable: addToImageTable,
    getAllImages: getAllImages,
    addToActivityTable: addToActivityTable,
    removeFromActivityTable: removeFromActivityTable,
    getAllActivityForUser: getAllActivityForUser,
    checkUsernameExists: checkUsernameExists,
    checkPasswordMatchesUsername: checkPasswordMatchesUsername,
    getUserInfo: getUserInfo
};

console.log("End of databse.js");