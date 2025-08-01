const { required } = require('joi');
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type : String,
        required:true,
    }
  //username and password is automatically created by local mongoose
});

userSchema.plugin(passportLocalMongoose);  //username and password is automatically created by local mongoose

module.exports = mongoose.model("User",userSchema);