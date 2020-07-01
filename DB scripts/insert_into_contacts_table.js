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
  //(contact_name, contact_email, contact_address, contact_phone,contact_favoriteplace, contact_favoriteplaceurl)
  let sql = 'INSERT INTO tbl_contacts (contact_name, contact_email, contact_address, contact_phone,contact_favoriteplace, contact_favoriteplaceurl) VALUES ?';
  let values = [
    [
      "Dr. Dan",
      "chal0006@umn.edu",
      "383 Shepherd Labs, 100 Union St. SE, Minneapolis, MN 55455",
      "(612)625-4002",
      "Shepherd Labs",
      "http://campusmaps.umn.edu/shepherd-laboratories"
    ],
    [
      "Ruofeng Liu",
      "liux4189@umn.edu",
      "Coffman Memorial, Room 2-209, 300 Washington Ave SE, Minneapolis, MN 55455",
      "(612)625-4002",
      "Coffman",
      "https://campusmaps.umn.edu/coffman-memorial-union"
    ],
    [
      "Harshit Jain",
      "jain0149@umn.edu",
      "University of Minnesota Sports Field Complex, 600 25th Ave SE, Minneapolis, MN 55414",
      "(612)624-9510",
      "Blue Door Pub (Como Ave)",
      "https://www.google.com/maps/place/Blue+Door+Pub+University/@44.987642,-93.2319058,17z/data=!4m13!1m7!3m6!1s0x52b32d067b5b1d95:0xee88dc4ea05b2361!2s1514+Como+Ave+SE,+Minneapolis,+MN+55414!3b1!8m2!3d44.987608!4d-93.2297234!3m4!1s0x52b32d067c9e1729:0x37b768c113d903e3!8m2!3d44.987642!4d-93.2297118"
    ],
    [
      "Yang He",
      "he000242@umn.edu",
      "Keller Hall, Room 2-209, 200 Union St. SE, Minneapolis, MN 55455",
      "(612)625-4002",
      "Keller Hall",
      "https://www.google.com/maps/place/Kenneth+H.+Keller+Hall,+200+Union+St+SE,+Minneapolis,+MN+55455/data=!4m2!3m1!1s0x52b32d17b13a375b:0x6c04b616cb83af04?sa=X&ved=2ahUKEwjE1aegyennAhWEH3AKHVUxBHYQ8gEwAHoECAsQAQ"
    ]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Value inserted");
  });
});