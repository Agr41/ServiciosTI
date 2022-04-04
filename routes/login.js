var express = require('express');
var router = express.Router();
var {client,dbName} = require('../db/mongo');
var passport = require('passport');
var LocalStrategy = require('passport-local');


passport.use(new LocalStrategy(
  async function(username, password, done) {

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuarios');
    await collection.findOne({ usuario: username }, function (err, user) {


      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      console.log(password);
      console.log(user.password);
      if (password!==user.password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.usuario);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/registro', async function(req, res){

  regUser(req.body)
  
    .then(()=>{
      res.render('login',{info: "Registrado"})
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      client.close()
    })

});

async function regUser(datos){

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('usuarios');
  await collection.insertOne(
    {
      usuario: datos.usuario,
      password: datos.password

    }
  )
}

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {


    res.redirect('/');
  });

module.exports = router;





/*
      password: passwordHash

        var password = datos.password;
  let passwordHash= bcryptjs.hashSync(password,9);

  
const app = express();
const bcryptjs = require('bcryptjs');
app.use(express.urlencoded({extended:false}));
app.use(express.json());

*/