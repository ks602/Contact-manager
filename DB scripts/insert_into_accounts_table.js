const mysql = require("mysql");
const crypto = require('crypto');

require("dotenv").config({
  path: __dirname + '/../.env'
});
const dbconfig = {
  "host": process.env["DB_HOST"],
  "user": process.env["DB_USER"],
  "password": process.env["DB_PASSWORD"],
  "database": process.env["DB_DATABASE"],
  "port": process.env["DB_PORT"]
};
const con = mysql.createConnection(dbconfig);

con.connect(function (err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");

  let rowToBeInserted = {
    acc_name: "charlie chan",
    acc_login: "charlie",
    acc_password: crypto.createHash('sha256').update("tango").digest('base64'),
    acc_role: "admin"
  };

  con.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Value inserted");
  });
});