const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirecturl){
      res.locals.redirecturl =req.session.redirecturl;
    }
    next();
}

module.exports.isowner =async(req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);  // ✅ Await here

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {  // ✅ Use req.user (set by Passport)
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isreviewauthor =async(req,res,next)=>{
  let {id, reviewid } = req.params;
    let review = await Review.findById(reviewid);  // ✅ Await here

    if (!review) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    if (!review.author.equals(req.user._id)) {  // ✅ Use req.user (set by Passport)
        req.flash("error", "You are not able to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};