const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground.js");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const User = require("./models/user");
const methodOverride=require("method-override");
const flash=require("connect-flash-plus");

const commentRoutes=require("./routes/comments"),
      campgroundRoutes=require("./routes/campgrounds"),
      indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));



// seed the database
// seedDB();

//passport configuration

app.use(require("express-session")({
    secret: "Pratham",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
})

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
  

app.listen(4000, function () {
    console.log("server started at port 4000")
})