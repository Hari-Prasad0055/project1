const express = require("express");
// const mongoose = require('mongoose');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl }=require("../middleware.js");
const usercontroller = require("../controllers/users.js");

router.get("/signup",usercontroller.signupget)

router.post("/signup",wrapAsync(usercontroller.signuppost));

router.get("/login",usercontroller.loginrender)
router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect : "/login" ,failureFlash:true}),usercontroller.loginpost);

//logout user
router.get("/logout",usercontroller.logoutrender)



module.exports = router ;