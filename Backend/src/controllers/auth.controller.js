const userModel=require("../models/users.model");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const tokenBlacklistModel=require("../models/blacklist.model")
const cacheService = require("../services/cache.service");
const bloomFilterService = require("../services/bloomFilter.service");

const isProduction = process.env.NODE_ENV === "production";

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    };
}

async function registerUserController(req,res){
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide username,email and password"
        })
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

     if (bloomFilterService.checkEmail(cleanEmail)) {
        // Filter says "might exist" -> Check DB to confirm
          const isUserAlreadyExists = await userModel.findOne({
          $or: [{ name: cleanUsername }, { email: cleanEmail }]
       });
        if (isUserAlreadyExists) {
           return res.status(400).json({
                message: 'Account already exists with this email address or username'
            });
        }
    }

    const hash=await bcrypt.hash(password,10);
    const user=await userModel.create({
        name:cleanUsername,
        email:cleanEmail,
        password:hash
    });

     bloomFilterService.addEmail(user.email);

     const token=jwt.sign(
        {id:user._id,username:user.name},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     )
     res.cookie("token", token, getCookieOptions())
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.name,
            email:user.email
        }
    })
}

async function loginUserController(req,res){
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Please provide email and password"
        })
    }
    const cleanEmail = email.trim().toLowerCase();

    if (!bloomFilterService.checkEmail(cleanEmail)) {
           return res.status(400).json({
           message: "No account found with this email. Please register first."
        });
    }
    const user=await userModel.findOne({email: cleanEmail}).lean();
    if(!user){
        return res.status(400).json({
            message:"No account found with this email. Please register first."
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Incorrect password. Please try again."
        })
    }
    const token=jwt.sign(
        {id:user._id,username:user.name},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
     )
     res.cookie("token", token, getCookieOptions());
     res.status(200).json({
        message:"User loggedIn successfully",
        user:{
            id:user._id,
            username:user.name,
            email:user.email
        }
     })
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;
  if (token) {
    await tokenBlacklistModel.create({ token });

    cacheService.set(`blacklist:${token}`, true, 86400);

    if (req.user?.id) {
      cacheService.del(`user:${req.user.id}`);
    }
  }

  res.clearCookie("token", getCookieOptions());
  res.status(200).json({
    message: "User logged out successfully"
  });
}

async function getMeController(req, res) {
    const cacheKey = `user:${req.user.id}`;
    const user = await cacheService.getOrSet(
       cacheKey,
       async () => {
           return await userModel
               .findById(req.user.id)
                .select("name email");
        },
        1800 // 30 minutes
    );

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: req.user.id,
            username: user.name,
            email: user.email
        }
    });
}

module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};
