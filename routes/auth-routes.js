const router = require('express').Router();
const passport = require('passport');

//authlogin
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/error'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      console.log(req.user.username)
      return res.redirect(`/success`);
    });
  })(req, res, next);
});



//auth logout
router.get('/logout', function(req, res) {
  if(req.isAuthenticated()){
    console.log("user logging out");
    req.logOut();
    res.send("user has logged out");
  } else {
    res.send("You don't have a session open");
  }
});

//auth with Google 
router.get('/google', passport.authenticate('google',{
  scope:['profile']
  }));

//callbck route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'),(req,res) => {
  res.send('Welcome, ' + req.user.g_name);
});



module.exports = router;