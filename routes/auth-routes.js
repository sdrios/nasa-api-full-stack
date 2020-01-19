const router = require('express').Router();
const passport = require('passport');

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
    //res.send("Welcome, " + req.user.username);
    res.render('user-homepage.ejs');

    next(); 
  } else {
    res.send("username and pass not recognized.");
  }
});

//auth logout
router.get('/logout',(req, res)=> {
  if(req.isAuthenticated()){
    console.log("user logging out");
    req.logOut();
    res.send("user has logged out");
    //render('homepage');
  } else {
    res.send("You don't have a session open");
  }
});

//auth Google 
router.get('/google', passport.authenticate('google',{
  scope:['profile']
  }));

//auth Google success
router.get('/google/redirect', passport.authenticate('google'),(req,res) => {
  res.send('Welcome, ' + req.user.g_name);
  //render('userhomepage.ejs');
});



module.exports = router;