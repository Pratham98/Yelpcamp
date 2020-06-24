const express=require("express");
const router=express.Router();

const Campground=require("../models/campground");
const Comment=require("../models/comment");
const middleware=require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res, next) {

    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });


});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function (req, res, next) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash('error','Something went wrong');
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success','Successfully added comment');
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res,next){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
});
});

//update comment
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res,next){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//destroy comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res,next){
    Comment.findByIdAndDelete(req.params.comment_id,function(err,deletedCampground){
        if(err){
            res.redirect("back");
        }else{
            req.flash('success','Comment deleted');
            res.redirect("/campgrounds/"+req.params.id);

        }
    })
});

module.exports=router;