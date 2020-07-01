const mysql = require("mysql");

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
  let sql = `CREATE TABLE tbl_accounts(acc_id INT NOT NULL AUTO_INCREMENT,
                                       acc_name VARCHAR(20),
                                       acc_login VARCHAR(20),
                                       acc_password VARCHAR(50), PRIMARY KEY (acc_id))`;
  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Table created");
  });
});