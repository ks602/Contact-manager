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
  let sql = `CREATE TABLE tbl_contacts(contact_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         contact_name VARCHAR(30),
                                         contact_email VARCHAR(30),
                                         contact_address VARCHAR(80),
                                         contact_phone VARCHAR(30),
                                         contact_favoriteplace VARCHAR(30),
                                         contact_favoriteplaceurl VARCHAR(1024))`;
  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Table created");
  });
});