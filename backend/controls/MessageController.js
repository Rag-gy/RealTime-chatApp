const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const sendMessage = asyncHandler(async(req, res)=>{
    // before anything think of what you need to send a message, they include chatId(reciever), message, and the userId(Sender)
    const {content, chatId} = req.body
    if(!content || !chatId){
        console.log("Invalid Data passed to the request")
        return res.sendStatus(400)
    }
    var newMessage = {     // trust me you have to look at the data model and insert to ensure less or no trouble
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    
    try {
        let message = await Message.create(newMessage)  // A query Object
        
        message = await message.populate("sender", "name picture") // you might ask why not populate on the above line while instanting rather populating a line below. Well we dont want to populate the data we get but just the instance we have created for the data
        // a document
        message = await message.populate("chat")
        message = await User.populate(message, {
            path:'chat.users',
            select:'name picture email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message, 
        })
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessage = asyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
        .populate('sender', 'name picture email')
        .populate('chat')
    
    res.json(messages)
    } 
    catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {sendMessage, allMessage}