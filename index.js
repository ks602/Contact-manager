const express = require("express");
// create an express application
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const mysql = require("mysql");

require("dotenv").config();
const dbconfig = {
  "host": process.env["DB_HOST"],
  "user": process.env["DB_USER"],
  "password": process.env["DB_PASSWORD"],
  "database": process.env["DB_DATABASE"],
  "port": process.env["DB_PORT"]
};

dbconfig.connectionLimit = 100;
pool = mysql.createPool(dbconfig);

// init body-parser
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false
}));

// middle ware to serve static files
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/js', express.static(__dirname + '/client/js'));

// server listens on port 9007 for incoming connections
app.listen(process.env.PORT || 9001, () => console.log('Listening on port 9001!'));


app.get('/', function (req, res) {
  res.redirect('/login');
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login', function (req, res) {
  if (req.session.loginUser) {
    res.redirect('/contact');
  } else {
    res.sendFile(__dirname + '/client/login.html');
  }
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact', function (req, res) {
  if (!req.session.loginUser) {
    res.redirect('/login');
  } else
    res.sendFile(__dirname + '/client/contact.html');
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact', function (req, res) {
  if (!req.session.loginUser) {
    res.redirect('/login');
  } else
    res.sendFile(__dirname + '/client/addContact.html');
});

//GET method for stock page
app.get('/stock', function (req, res) {
  if (!req.session.loginUser) {
    res.redirect('/login');
  } else
    res.sendFile(__dirname + '/client/stock.html');
});

app.get('/admin', (req, res) => {
  if (!req.session.loginUser) {
    res.redirect('/login');
  } else
    res.sendFile(__dirname + '/client/admin.html');
})

// log out of the application
// destroy user session
app.get('/logout', function (req, res) {
  req.session.destroy(err => {
    if (err)
      throw err;
  })
  res.redirect('/');
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts and sends the response back to client
// app.get('/getListOfContacts', function (req, res) {
app.get('/contacts', function (req, res) {
  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "SELECT * FROM tbl_contacts";
      con.query(sql, (err, result) => {
        if (err)
          throw err;
        else {
          res.send(result);
        }
      })
    }
    con.release();
  })
});

// POST method to insert details of a new contact to tbl_contacts table
// app.post('/postContact', function (req, res) {
app.post('/contact', function (req, res) {
  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "INSERT INTO tbl_contacts SET ?";
      let values = {
        contact_name: req.body["contactName"],
        contact_email: req.body["email"],
        contact_address: req.body["address"],
        contact_phone: req.body["phoneNumber"],
        contact_favoriteplace: req.body["favoritePlace"],
        contact_favoriteplaceurl: req.body["favoritePlaceURL"]
      };
      con.query(sql, values, (err, result) => {
        if (err)
          throw err;
        else {
          res.redirect("/contact");
        }
      })
    }
    con.release();
  })
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  encryptedPw = crypto.createHash('sha256').update(password).digest('base64');

  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "SELECT acc_password FROM tbl_accounts WHERE acc_login = ?";
      con.query(sql, username, (err, result) => {
        if (result.length > 0 && result[0]["acc_password"] == encryptedPw) {
          req.session.loginUser = username;
          res.json({
            status: true
          });
        } else
          res.json({
            status: false
          });
      });
    }
    con.release();
  })
});

// app.get('/getListOfAccounts', (req, res) => {
app.get('/accounts', (req, res) => {
  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "SELECT acc_id, acc_name, acc_login FROM tbl_accounts";
      con.query(sql, (err, result) => {
        if (err)
          throw err;
        res.send(result)
      });
    }
    con.release();
  })

})

// app.post('/addUser', (req, res) => {
app.post('/user', (req, res) => {
  let credentials = {
    acc_name: req.body.acc_name,
    acc_login: req.body.acc_login,
    acc_password: crypto.createHash('sha256').update(req.body.acc_password).digest('base64')
  };

  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "SELECT * FROM tbl_accounts WHERE acc_login = ?";
      con.query(sql, credentials.acc_login, (err, result) => {
        if (err)
          throw err;
        if (result.length > 0) {
          res.json({
            status: false
          });
        } else {
          sql = "INSERT INTO tbl_accounts SET ?";
          con.query(sql, credentials, (err, result) => {
            if (err)
              throw err;
            res.json({
              status: true
            });
          })
        }
      })
    }
    con.release();
  })
})

// app.post('/deleteUser', (req, res) => {
app.delete('/user', (req, res) => {
  let acc_login = req.body.acc_login;

  if (req.session.loginUser == acc_login)
    res.json({
      status: false
    });
  else {
    pool.getConnection((err, con) => {
      if (err)
        throw err;
      else {
        let sql = "DELETE FROM tbl_accounts WHERE acc_login = ?";
        con.query(sql, acc_login, (err, result) => {
          if (err)
            throw err;
          res.json({
            status: true
          });
        });
      }
      con.release();
    });
  }
})

// app.post('/editUser', (req, res) => {
app.put('/user', (req, res) => {
  let acc_id = req.body.acc_id;
  let acc_login = req.body.new_login;
  let acc_name = req.body.new_name;
  let acc_password = crypto.createHash('sha256').update(req.body.new_password).digest('base64');

  pool.getConnection((err, con) => {
    if (err)
      throw err;
    else {
      let sql = "SELECT acc_id FROM tbl_accounts WHERE acc_login = ?";
      con.query(sql, acc_login, (err, result) => {
        if (err)
          throw err;
        if (result.length > 0 && result[0]["acc_id"] != acc_id)
          res.json({
            status: false
          });
        else {
          sql = "UPDATE tbl_accounts SET acc_login = ?, acc_name = ?, acc_password = ? WHERE acc_id = ?";
          let data = [acc_login, acc_name, acc_password, acc_id];

          con.query(sql, data, (err, result) => {
            if (err)
              throw err;
            res.json({
              status: true
            });
          })
        }
      })
    }
    con.release();
  })
})

// function to return the 404 message and error to client
app.get('*', function (req, res) {
  res.status(404).send("404 Not Found.");
});