const Review = require("../models/review");
const Listing = require("../models/listing")

module.exports.postroute =async(req,res)=>{
    let data =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    req.flash("success"," Review Created!!");
   res.redirect(`/listings/${data._id}`);
}

module.exports.deletereview=async(req,res)=>{
  let { id , reviewid }=req.params;
  await Listing.findByIdAndUpdate(id,{$pull : { reviews : reviewid}});
  await Review.findByIdAndDelete(reviewid);
 req.flash("success"," Review Deleted !!");
  res.redirect(`/listings/${id}`);
}