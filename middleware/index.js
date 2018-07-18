const Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  //Is user logged in?
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground){
          req.flash("error", "Campground not found");
          res.redirect("back");
        }else {
          //Does the user own the campground?
          if (foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You do not have permission to do that");
            res.redirect("back");
          }
        }
    });
  }else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  //Is user logged in?
  if (req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
          res.redirect("back");
        }else {
          //Does the user own the comment?
          if (foundComment.author.id.equals(req.user._id)) {
            next();
          }else {
            req.flash("error", "You do not have permission to do that");
            res.redirect("back");
          }
        }
    });
  }else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

module.exports = middlewareObj;