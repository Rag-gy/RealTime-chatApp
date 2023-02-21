const asyncHandler = require('express-async-handler'); // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
const generateToken = require('../config/generateToken');
const user = require('../models/userModel')


const registerUser = asyncHandler(async (req, res)=>{

    const {name, email, password, picture} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Enter all required fields")
    }

    const userExist = await user.findOne({email})   // search for the email and if it already exists then we cannot create it again

    if(userExist){
        res.status(400)
        throw new Error('User already exists')
    }

    const User = await user.create({    // this will create a new user data and store it in the database ( yes i've verified it after finding the flow)
        name,
        email,
        password,
        picture,
    })

    if(User){
        res.status(201).json({
            _id: User._id,
            name: User.name,
            email: User.email,
            pic: User.picture,
            token:generateToken(User._id)
        })
    }
    else{
        res.status(400)   // status code 400 mean the server cannot or will not process the request due to something that is perceived to be a client error
        throw new Error('Cannot create user')
    }
});

const authUser = asyncHandler(async(req, res)=>{

    const {name, email, password} = req.body

    const User = await user.findOne({email})

    if(!User){
        res.status(404).send("User not found")  // status code 404 mean that the server cannot find the requested resource
    }
    // console.log("checking")

    if(await User.matchPassword(password) && name === User.name){
        console.log("finished checking")
        // console.log(generateToken(User._id))
        res.status(201).json({  // status 201 mean the request has succeeded and has led to the creation of a resource.
            _id: User._id,
            name: User.name,
            email: User.email,
            pic: User.picture,
            token:generateToken(User._id)
        })
    }
    else{
        res.status(401)     // status 401 means the client request has not been completed because it lacks valid authentication credentials for the requested resource
        throw new Error("Invalid Email or Password")
    }
})

const allUsers = asyncHandler( async (req, res)=>{  // this is used for searching the users
    const keyword = req.query.search ? {    // here we are checking to find if we have any query to search for
        $or: [
            {name : {$regex : req.query.search, $options: "i"}},    // here the regex is used to search for similar values and hte option = "i" denotes that it is case insensitive
            {email : {$regex : req.query.search, $options: "i"}}
        ]
    }:{}    // this is the other half which is if the search doesnt have any query

    const User = await user.find(keyword).find({_id:{$ne:req.user._id}})   // the keyword is the pattern which is used with help of regex
    res.send(User)          // here the $ne mean not equal to, as we dont want any query pointing to us
})

module.exports = {registerUser, authUser, allUsers}
