const express        = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    methodOverride   = require("method-override"),
    flash            = require("connect-flash"),
    LocalStrategy    = require("passport-local"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds.js"),
    indexRoutes      = require("./routes/index.js"),
    campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes    = require("./routes/comments.js");

//APP CONFIG
const dburl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";
mongoose.connect(dburl);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Seed database

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "This could be anything you know",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//=================
//ROUTES requiring
//=================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp started!!")
});