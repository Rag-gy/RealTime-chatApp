const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const user = require('../models/userModel');


const accessChat = asyncHandler(async (req, res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log("User Id param not sent with request")
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat:false, // The $all operator selects the documents where the value of a field is an array that contains all the specified elements
        $and:[{users:{$elemMatch:{$eq:req.user._id}}}, {users:{$elemMatch:{$eq:userId}}}]  
    }).populate("users", "-password").populate('latestMessage')    // this users is taken from the chatModel

    //  -password mean everything except the password
    // populate is used to merge the other data which belong to the user to the chatModel object
    // https://www.geeksforgeeks.org/mongoose-populate-method/  --- check this link to see clearly   

    isChat = await user.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email picture"
    })

    if(isChat.length > 0){
        res.send(isChat[0]) // this will have only one data element
    }
    else{   // if the chat doesnt exist we will create it
        var ChatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id, userId]
        }

        try {
            const createdChat = await Chat.create(ChatData)
            const newChat = await Chat.findOne({id:createdChat._id}).populate("users", "-password")
            res.status(200).send(newChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const fetchChat = asyncHandler(async (req, res)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        //    this users is a field from the mongoDB collection so it must be given properly
        .populate("users", "-password") // here if you dont give -password then it will also add the password data while populating
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})   // this updatedAt is by timestamp and -1 sort means the latest data is at front
        .then(async (result)=>{
            result = await user.populate(result, {  // here we populate aka add the data in latestMessage as it is a column chatModel and select the name email and picture from it 
                path: "latestMessage.sender",
                select: "name picture email"
            })
            // console.log("Here are the results", result)
            console.log(result)
            res.status(200).send(result)
        })
    }
    catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name){
        console.log("fill all fields")
        res.status(400).send({message:"Please Fill out ALl the fields"})
        return
    }

    var users = JSON.parse(req.body.users)  // here the req.body.users will be more like a stringified JSON object and that is why we parse it here
    
    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group")
    }

    users.push(req.user)    // we have to add ourselves in the group as well

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat:true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const renameGroup = asyncHandler(async(req, res)=>{
    const {chatId, chatName} = req.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName: chatName}, {new:true})  // the first parameter is wht we use to find, the second parameter is what we want to update and the third parameter denotes the return value
    //                                              if you dont give new:true, then you will only receive the old name which we dont need anymore
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat not found");
    }
    else{
        res.json(updatedChat);
    }
})

const addToGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body

    const added = await Chat.findByIdAndUpdate(
        chatId, 
        {$push:{users: userId}}, // at first i thought of taking the user id and pushing it and then sending it back again
        {new:true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        
        if(!added){
            res.status(404).send("No group exists")
        }
        else{
            res.status(200).json(added)
        }
})

const removeFromGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body

    const remove = await Chat.findByIdAndUpdate(
        chatId, 
        {$pull:{users: userId}}, // at first i thought this was gonna be alot of work but this doesnt seem it
        {new:true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        
        if(!remove){
            res.status(404).send("No group exists")
        }
        else{
            res.status(200).json(remove)
        }
})

module.exports = {accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup}

