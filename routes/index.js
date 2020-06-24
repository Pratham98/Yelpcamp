const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../models/user");
router.get('/', function (req, res, next) {
    res.render("landing");
});



//auth routes

router.get('/register',function(req,res,next){
    res.render("register");
})

router.post("/register",function(req,res,next){
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash('error',err.message);
            console.log(err);
            return res.render('register')
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash('success','Welcome to Yelpcamp '+user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})

router.get('/login',function(req,res,next){
    res.render("login");
})

router.post('/login',passport.authenticate("local",{
successRedirect:"/campgrounds",
failureRedirect:"/login"
}), function(req,res,next){
});

router.get("/logout",function(req,res,next){
    req.logOut();
    req.flash('success',"logged you out!")
    res.redirect("/campgrounds");
})

module.exports=router;