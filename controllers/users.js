const User =require("../models/user");

module.exports.signupget =(req,res)=>{
    res.render("./users/signup.ejs");
}
module.exports.signuppost=async (req,res)=>{
    try{
        let {username ,password, email} =req.body;
    const newuser = new User({email , username});
    const registereduser = await User.register(newuser,password);
    req.login(registereduser,(err)=>{ //it is used when we signed up then automatically logined
        if(err){
            return next(err);
        }else{
         req.flash("success","Welcome to wanderlust");
         res.redirect("/listings");
        }
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}
module.exports.loginpost= async(req,res)=>{ //passport.authencate isa a kmiddleware used to check the password exits or not
     req.flash("success","Logined successfully");
     let redirectUrl = res.locals.redirecturl || "/listings";
     res.redirect(redirectUrl);
}
module.exports.loginrender=(req,res)=>{
     res.render("./users/login.ejs");
}
module.exports.logoutrender=(req,res)=>{
    req.logout((err)=>{
         if(err){     //req.logout is is inbuilt function
            next(err);
         }else{
            req.flash("success","you are logged out!");
            res.redirect("/listings");
         }
    })
}