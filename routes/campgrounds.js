const express   = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middlewareObj = require("../middleware"),
    sanitizeHtml = require("sanitize-html");

//INDEX - Display all campgrounds
router.get("/", function(req, res){
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",{campgrounds: allCampgrounds});
    }
  });
});

//NEW - Show form to create new campground
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
   res.render("campgrounds/new"); 
});

//CREATE - Add new campground to the database
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  };
  req.body.campground.description = sanitizeHtml(req.body.campground.description);
  Campground.create(req.body.campground, function(err, newlyCreatedCampground){
    if(err){
      req.flash("error", err.message);
      console.log(err);
    }else {
      req.flash("success", "Successfully created campground");
      res.redirect("/campgrounds");
    }
  });
});

//SHOW - display more information about a campground
router.get("/:id", (req, res) => {
    //find the campground, with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err || !foundCampground){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
      }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
  req.body.campground.description = sanitizeHtml(req.body.campground.description);
  Campground.findByIdAndUpdate(req.params.id, /* The information to update */req.body.campground, (err, updatedCampground) => {
    if (err) {
      req.flash("error", "Something went wrong");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully updated!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully removed!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;