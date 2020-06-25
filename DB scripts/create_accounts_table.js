const mysql = require("mysql");
const dbconfig = require("../dbconfig.json");
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