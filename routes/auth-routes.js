const router = require('express').Router();
const passport = require('passport');
const axios = require('axios').default;
const models = require('../models');

//auth login
router.post('/login',(req, res, next) => {
  passport.authenticate('local',(err, user, info) =>{
    if (err) { return next(err); }
    if (!user) { return res.redirect('/error'); }
    req.logIn(user,(err)=> {
      if (err) { return next(err); }
      console.log(req.user.username)
      return res.redirect(`/auth/success`);
    });
  })(req, res, next);
});

//auth login success
router.get('/success', (req, res, next) => {
  if (req.isAuthenticated()) {
        axios.get('https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date=')
        .then((data)=>{
          // res.render('user-homepage.ejs', {username:
          // {username: req.user.username}
          res.render('user-homepage.ejs', {nasaData: {
                copyright: data.data.copyright,
                date: data.data.date,
                expl: data.data.explanation,
                url: data.data.url
          }})
        });
    //next(); 
  } 
  else {
    res.render('error.ejs');
  }
});

router.post('/add-favorite', (req, res, next) => {

  if (req.isAuthenticated()) {
    console.log(req.body)
    console.log(req.user.id)
    console.log(typeof req.user.id)
    console.log(req.body.date)
    console.log(typeof req.body.date)

     models.favorites.create({
        imageDate: req.body.date, 
        userID: req.user.id
  }).then((newFavorite)=>{
    console.log(newFavorite)
  });

    res.render('favorites.ejs')
    next(); 
  } 
  else {
    res.send("ERROR");
    //res.render('error.ejs');
  }
});

//auth logout
router.get('/logout',(req, res)=> {
  if(req.isAuthenticated()){
    console.log("user logging out");
    req.logOut();
    //res.send("user has logged out");
    res.render('logout.ejs');
  } else {
    res.send("You don't have a session open");
    //render('homepage');
  }
});

router.get('/favorites',(req, res)=> {
  if(req.isAuthenticated()){
    res.render('favorites.ejs')
  } else {
    //res.send("You don't have a session open");
    res.render('homepage.ejs');
  }
});


//auth Google 
router.get('/google', passport.authenticate('google',{
  scope:['profile']
  }));

//auth Google success
router.get('/google/redirect', passport.authenticate('google'),(req,res) => {
  //res.send('Welcome, ' + req.user.g_name);
  axios.get('https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date=')
  .then((data)=>{
    res.render('user-homepage.ejs', {nasaData: {
      copyright: data.data.copyright,
      date: data.data.date,
      expl: data.data.explanation,
      url: data.data.url,
    }})
  })
});

module.exports = router;