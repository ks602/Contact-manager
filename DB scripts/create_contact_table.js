const mysql = require("mysql");
const dbconfig = require("../dbconfig.json");
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