const mysql = require("mysql");
const crypto = require('crypto');
const dbconfig = require("../dbconfig.json");
const con = mysql.createConnection(dbconfig);

con.connect(function (err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");

  let rowToBeInserted = {
    acc_name: 'charlie', // replace with acc_name chosen by you OR retain the same value
    acc_login: 'charlie', // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update("tango").digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

  let sql = ``;
  con.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Value inserted");
  });
});