const jwt = require('jsonwebtoken')
const user = require('../models/userModel')
const asyncHandler = require("express-async-handler")

const verify = asyncHandler(async(req, res, next)=>{
    let token;  // we create this initially to store the token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            // the token will look like Bearer asdahdkgajds(this is a token)
            
            token = req.headers.authorization.split(" ")[1];    // this is why I said to create token
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY)   // this will verify the token we got by generating it and comparing and giving the output
            
            req.user = await user.findById(decoded.id).select("-password")
            //  theres many like findByIdandUpdate and more also you might wonder why "-password" well this means select everything except the password

            next()  // once we're done with all of it we move to the next
        }
    catch(err){
        res.status(401)
        throw new Error("Not Authorized, please verify your Token")
    }
    }

    if(!token){ // so we can check it
        res.status(401)
        throw new Error("No Token provided")
    }
})


module.exports = {verify}