var express = require('express');
var router = express.Router();
var {client,dbName} = require('../db/mongo');
var passport = require('passport');
var LocalStrategy = require('passport-local');

const app = express();
const bcryptjs = require('bcryptjs');
app.use(express.urlencoded({extended:false}));
app.use(express.json());



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

router.post('/registro', function(req, res, next){
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
    const usuario = req.body.usuario;
    const password = req.body.password;
    if (usuario == usuario && password == password ){
    let passwordHash= bcryptjs.hashSync(password,9);
    console.log("funcionó")
        console.log((passwordHash));
        console.log(password)
    }
    else {
    console.log("no funcionó")
    }
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
