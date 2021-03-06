require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const models = require('./models');
const bodyParser = require("body-parser");
const session = require("express-session");
const pbkdf2 = require('pbkdf2');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authRoutes = require('./routes/auth-routes');
const axios = require('axios').default;

//set up view engine
app.set('view engine','ejs');

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

//serialize users
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
  res.render('homepage.ejs'); 
});

//nasa get request renders on user homepage 
app.get('/nasa-api', (req, res) => {
  axios.get('https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date=')
  .then((data)=>{
    console.log(data.data);

    res.render('user-homepage.ejs', {nasaData: {
      copyright: data.data.copyright,
      date: data.data.date,
      expl: data.data.explanation,
      url: data.data.url,
      title:data.data.title
    }})
  })
});

//nasa post request renders when user selects date
app.post('/nasa-api-2', (req, res) => {
  let userDate = req.body.userDateInput;
  axios.get('https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date=' + userDate)
  .then((data)=>{
    res.render('user-homepage.ejs', {nasaData: {
      copyright: data.data.copyright,
      date: data.data.date,
      expl: data.data.explanation,
      url: data.data.url,
      title:data.data.title
    }})
  })
});

app.get("/sign-in", (req, res)=>{
res.render('login.ejs');
});

app.get("/sign-up", (req, res)=>{
res.render('sign-up-page.ejs');
});

app.post("/sign-up", (req, res) => {
  models.user.create({
    username: req.body.username, 
    password: encryptionPassword(req.body.password)
  })
    .then((user) =>{
    res.render('reg-login.ejs');
    });
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password.ejs');
});

app.post('/update-password', (req, res, done) => {
  models.user.findOne({
    where: {
      username: req.body.username
    }
  }).then((user) => {
    if (!user) {
      res.send("There was an error resetting your password.  Please go back to the main site.");
      return done(null, false)
    } else {
      models.user.update({
        password: encryptionPassword(req.body.password),
      }, {
        where: {
          username: req.body.username
        }
      })
    }
    res.render('updated-password.ejs');
  });

})

app.get('/error', (req, res) => res.render("error.ejs"));


/* PASSPORT LOCAL AUTHENTICATION */
passport.use(new LocalStrategy(
  (username, password, done) =>{
    models.user.findOne({
      where: {
        username: username
      }
    }).then((user) =>{
      if (!user) {
        return done(null, false);
      }
      if (user.password != encryptionPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    }).catch((err)=> {
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
      console.log(currentUser);
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
    password, process.env.SALT_KEY, 36000, 256, 'sha256'
  );
  var hash = key.toString('hex');
  return hash;
}


app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + 
  process.env.PORT + ' app name = ' + 
  process.env.PROJECT_NAME);
})