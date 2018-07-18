const express   = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middlewareObj = require("../middleware");

//NEW COMMENTS ROUTE shows the new comment form to post a new comment
router.get("/new", middlewareObj.isLoggedIn, (req, res) =>{
  Campground.findById(req.params.id, (err, foundCampground) =>{
    if (err) console.log(err);
    else res.render("comments/new", {campground: foundCampground});
  });
});

// Adds the new comment to the database
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else{
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) {
      res.redirect("back");
    }else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  })
});


//UPDATE ROUTE
router.put("/:comment_id", middlewareObj.checkCommentOwnership,  (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//DESTROY ROUTE
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;