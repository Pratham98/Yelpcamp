const express=require("express");
const router=express.Router();
const Campground=require("../models/campground");
const middleware=require("../middleware");

router.get('/campgrounds', function (req, res, next) {
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", { campgrounds: allcampgrounds,currentUser:req.user});
        }
    })

});

router.post("/campgrounds",middleware.isLoggedIn, function (req, res, next) {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author={
        id:req.user._id,
        username:req.user.username
    }
    let newCampground = { name: name, image: image, description: description,author:author };

    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success','successfully added a new campground');
            res.redirect("/campgrounds");
        }
    });

});

router.get("/campgrounds/new",middleware.isLoggedIn, function (req, res, next) {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function (req, res, next) {

    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });


});

//edit campground route
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res,next){

    Campground.findById(req.params.id,function(err, foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground})
    });    
});

//update campground route
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res,next){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//destroy campground 
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res,next){
    Campground.findByIdAndDelete(req.params.id,function(err,deletedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash('error','Successfully deleted a campground');
            res.redirect("/campgrounds");

        }
    })
});

module.exports=router;