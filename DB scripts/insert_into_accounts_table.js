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
    acc_name: '', // replace with acc_name chosen by you OR retain the same value
    acc_login: '', // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update("password").digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

  let sql = ``;
  con.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Value inserted");
  });
});