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
          res.render('user-homepage.ejs', {nasaData: {
                copyright: data.data.copyright,
                date: data.data.date,
                expl: data.data.explanation,
                url: data.data.url,
                title:data.data.title
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

    let userDataParsed = req.body.userFavoriteData.split(',',4);
    
     models.favorites.create({
        imageDate: userDataParsed[0], 
        userID: req.user.id,
        imageURL: userDataParsed[1],
        imageTitle: userDataParsed[2],
        imageCopyright:userDataParsed[3] 

  }).then((newFavorite)=>{
    console.log(newFavorite)
  }); 
  res.render('favorites.ejs',{
          favorites: faveArray
        });
    next();
  } 
  else {
    res.render('error.ejs');
  }
});

//get user favorites
router.get('/favorites', (req, res) => {
  if (req.isAuthenticated()) {
    models.favorites.findAll({
      userID: req.user.id
    })
      .then(userFaves => {
        let faveArray = userFaves.map((fave) => {
          return fave.dataValues
        });

        res.render('favorites.ejs', {
          favorites: faveArray
        })
      })
  }
  else {
    res.send("You don't have a session open");
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
      title:data.data.title
    }})
  })
});

module.exports = router;