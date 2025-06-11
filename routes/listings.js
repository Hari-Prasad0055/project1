const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/express.js");
const { isloggedin ,isowner } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer')
const  {storage} =require("../config.js");
const upload = multer({storage });

const validateListing = (req,res,next)=>{
    let result =listingSchema.validate(req.body);
     if(result.error){
        throw new ExpressError(404,result.error);
     }
     else{
        next();
     }
}


//index route
router.get("/",wrapAsync(listingcontroller.index));
//new route
router.get("/new",isloggedin,listingcontroller.rendernewform);

//show route

router.get("/:id",wrapAsync(listingcontroller.showlisting));

//create route
router.post("/",isloggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.createlisting)); 
//edit route
router.get("/:id/edit",isloggedin,isowner,validateListing, wrapAsync(listingcontroller.editlisting)); 

//update route
router.put("/:id", isloggedin,isowner,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.updatelisting));

//delete route
router.delete("/:id",isloggedin,isowner, wrapAsync(listingcontroller.deletelisting));

module.exports = router;