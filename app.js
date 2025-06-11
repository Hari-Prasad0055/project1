if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
};
// console.log(process.env.SECRET);//WE ACCESS ENV FILES FROM THIS PROCESS.ENV

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride =require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/express.js");
const  listingRouter = require("./routes/listings.js");
const  reviewRouter = require("./routes/reviews.js");
const  userRouter = require("./routes/user.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dburl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


main().then(res=>{console.log("connection successfull")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);

}

const store=MongoStore.create({
    mongoUrl :dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600
});
store.on("error",()=>{
    console.log("error in mango session store",err)
})

const sessionoptions ={
    store,
      secret:process.env.SECRET, 
      resave : false,
      saveUninitialized :true,
      cookie:{
        expire :Date.now() + 7 * 24 * 60 * 60 *1000 ,   //cookies for session time out
        maxAge : 7 * 24 * 60 * 60 *1000 ,
        httpOnly : true,
      }
};



app.use(session(sessionoptions));
app.use(flash()); //to use flash //comes before routings

app.use(passport.initialize()); //a middleware that initialize passports
app.use(passport.session()); // it is able to identify the session when we open in differnt tabs
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success =req.flash("success"); //to call flash on page // use these success in suitable route
    res.locals.error =req.flash("error");
    res.locals.curruser= req.user;
    next(); 
})

app.get("/",(req,res)=>{
    res.render("./listings/home.ejs");
});
// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"stu@gmail.com",
//     username: "hari",
//   });
//   let registereduser = await User.register(fakeUser,"hello"); //we use register method save user helloworld is password\
//   console.log(registereduser);
//   res.send("success");
  
// });



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });
app.use((err,req,res,next)=>{
    let {statusCode =500 , message="something went wrong!!"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
});