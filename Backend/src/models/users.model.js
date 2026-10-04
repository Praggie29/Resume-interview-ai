const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:[true,"username already taken"],
        required:true,
    },
    email:{
        type:String,
        unique:[true,"email already registered with this email address" ],
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;