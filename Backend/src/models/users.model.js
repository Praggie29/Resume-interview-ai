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
        index:true,
    },
    password:{
        type:String,
        required:true,
    }
});

// userSchema.index({ email: 1 });
// What this line means:
// It explicitly tells MongoDB to store all emails in an ascending (A to Z) B+ Tree index.
//
// Why it is commented out:
// We already have 'index: true' inside the email field above, which creates this exact same
// B+ Tree index automatically. So writing this extra line is optional and redundant, but it helps
// demonstrate how MongoDB does O(log N) index lookups under the hood for fast logins.

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;