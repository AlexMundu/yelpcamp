const express       = require("express"),
        User        = require("../models/user"),
        passport    = require("passport"),
        router      = express.Router();

//Landing route
router.get("/", function(req, res){
  res.render("landing");
});


//==========
// AUTH ROUTES
//==========

//Display the registration for
router.get("/register", (req, res) => {
  res.render("register");
});


//Handle sing up logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err){
      req.flash("error", err.message);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Yelpcamp " + user.username);
      res.redirect("/campgrounds");
    })
  });
});

//LOGIN and LOGOUT Routes

//Display the form to login
router.get("/login", (req, res) => {
  res.render("login");
});

//Login user logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
});

//Log out user logic
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logout! Bye!");
  res.redirect("/campgrounds");
});

module.exports = router;