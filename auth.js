const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
};

function loginAuth(req, res, next) {
  if (req.session.user != null) {
    next();
  } else {
    res.status(403);
    res.redirect('/login');
  }
}

function adminAuth(req, res, next) {
  if (req.session.role == ROLE.ADMIN) {
    next();
  } else {
    res.status(401).send("Unauthorized!");
  }
}

module.exports = {
  ROLE,
  loginAuth,
  adminAuth
};