const express = require("express");
const router = express.Router({mergeParams : true}); //to get body from app.js to reviews.js
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/express.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isloggedin ,isreviewauthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js")


const validateReview = (req,res,next)=>{
    let result =reviewSchema.validate(req.body);
     if(result.error){
        throw new ExpressError(404,result.error);
     }
     else{
        next();
     }
}


//reviews 
//post route
router.post("/",isloggedin,validateReview,wrapAsync(reviewcontroller.postroute));
//delete review
router.delete("/:reviewid",isloggedin, isreviewauthor ,wrapAsync(reviewcontroller.deletereview));

module.exports =  router;