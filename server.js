require('dotenv').config();
const express = require("express");
const app = express();
const models = require('./models');
const bodyParser = require("body-parser");
const session = require("express-session");
var pbkdf2 = require('pbkdf2');
var salt = process.env.SALT_KEY;
const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authRoutes = require('./routes/auth-routes');

//set up view engine
//app.set('view engine','ejs');



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use('/auth', authRoutes); //set up routes

/*  PASSPORT SETUP  */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.user.findByPk(id).then((user) => {
    done(null, user);
  });
});

//homepage route
app.get('/', (req, res)=>{
  res.render('homepage'); 
});

app.post("/sign-up", function (req, response) {
  models.user.create({ 
    username: req.body.username, 
    password: encryptionPassword(req.body.password)
  })
    .then(function (user) {
      response.send(user);
    });
});

app.get('/forgot-password', (req,res)=>{
  res.render('forgot-password')
});

app.get('/success', function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.login();
    res.send("Welcome " + req.user.username + "!!");
    next(); 
  } else {
    res.send("username and pass not recognized.");
  }
});

app.get('/error', (req, res) => res.send("wow error logging in"));


/* PASSPORT LOCAL AUTHENTICATION */
passport.use(new LocalStrategy(
  function (username, password, done) {
    models.user.findOne({
      where: {
        username: username
      }
    }).then(function (user) {
      if (!user) {
        return done(null, false);
      }

      if (user.password != encryptionPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    }).catch(function (err) {
      return done(err);
    });
  }
));



//PASSPORT-GOOGLE STRATEGY
passport.use(new GoogleStrategy({
  //options for google strategy
  callbackURL: '/auth/google/redirect',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  //check if user already exists in db
  models.user.findOne({
    where: {
      g_id: profile.id
    }
  }).then((currentUser) => {
    if (currentUser) {
      //already have user in db
      console.log("the user exists in db as: " + profile.displayName);
      done(null, currentUser);
    } else {
      models.user.create({
        g_name: profile.displayName,
        g_id: profile.id
      }).then((newUser) => {
        console.log("New User created: " + newUser);
        done(null, newUser);
      });
    }
  });
}));

function encryptionPassword(password) {
  var key = pbkdf2.pbkdf2Sync(
    password, salt, 36000, 256, 'sha256'
  );
  var hash = key.toString('hex');
  return hash;
}

app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + 
  process.env.PORT + ' app name = ' + 
  process.env.PROJECT_NAME);
})