const Listing = require("../models/listing");

module.exports.index= async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.rendernewform =(req,res)=>{
   res.render("./listings/new.ejs");
    }

module.exports.showlisting=async(req,res)=>{
     let { id }= req.params;
     const listing= await Listing.findById(id).populate({path:"reviews",populate :{path:"author"},}).populate("owner");
     if(!listing){
        req.flash("error","Listing Does Not Exist!!");
        res.redirect("/listings");
     }else{
        res.render("./listings/show.ejs" ,{ listing });
     }
     
};

module.exports.createlisting=async(req,res,next)=>{
     let url =  req.file.path;
     let filename = req.file.filename;
     const newListing= new Listing(req.body.listing);
     newListing.owner = req.user._id; //to save owner
     newListing.image = { url , filename };
     await newListing.save();
     req.flash("success","New Listing Created!!");  // to get flash 
     res.redirect("/listings"); 
};
module.exports.editlisting=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Does Not Exist!!");
        res.redirect("/listings");
     }
     let originalurl=listing.image.url;
      originalurl=originalurl.replace("/upload","/upload/h_250,w_250");
    res.render("./listings/edit.ejs",{ listing ,originalurl });
}
module.exports.updatelisting =async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !="undefined"){
     let url =  req.file.path;
     let filename = req.file.filename; 
     listing.image ={url,filename};
     await listing.save();
    } 
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
}
module.exports.deletelisting=async (req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndDelete(id);
       req.flash("success"," Listing Deleted !!");
      res.redirect("/listings");
}