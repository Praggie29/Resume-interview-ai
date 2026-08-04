const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const cacheService = require("../services/cache.service");

async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({
            message: "Token not provided"
        });
    }

    const isTokenBlacklisted = await cacheService.getOrSet(
        `blacklist:${token}`,
        async () => await tokenBlacklistModel.findOne({ token }),
        300
    );

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        });
    }
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded
    next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
   

}

module.exports={authUser}