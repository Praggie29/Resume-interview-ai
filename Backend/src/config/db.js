const mongoose=require("mongoose");
const bloomFilterService = require("../services/bloomFilter.service");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database");
        await bloomFilterService.initFromDB();
    }
    catch(err){
        console.log(err);
    }
}
        

module.exports=connectDB;