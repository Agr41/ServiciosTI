var express = require('express');
var router = express.Router();
var passport = require('passport');
var {client,dbName} = require('../db/mongo');

passport.deserializeUser(
    async function(id, done) {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('usuarios');
      collection.findOne({usuario:id}, function (err, user) {
        done(err, user);
  });
});

/* GET users listing. */
/* router.get('/', function(req, res, next) {
  res.render('home')
}); */

router.get('/',(req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login')
  }
}, function(req, res, next) {
  res.render('home')
});

module.exports = router;
