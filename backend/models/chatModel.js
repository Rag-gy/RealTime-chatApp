const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName:{type:String, trim:true},
        isGroupChat:{type:'boolean', default:false}, 
        users : [{
            type:mongoose.Schema.Types.ObjectId,    // this is used to get the object id
            ref:"User"
        }],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true // this is used to set a timestamp everytime the data is created
    }
)

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;