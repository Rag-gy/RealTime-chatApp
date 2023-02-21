const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/DB')
const messageRouter = require('./route/messageRoute')
const userRouter = require('./route/userRoute')
const chatRouter = require('./route/chatRoute')
const { notFound, errorHandler } = require('./middleware/errorManagement')
const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res)=>{
    res.send("Welcome to the server")
})

app.use('/user', userRouter)   // The app.use() is more like a method to configure the middleware used by the routes of the Express HTTP server object.
app.use('/chat', chatRouter)
app.use('/message', messageRouter)
app.use(notFound)   // if all the routes are not satisified then we have a link which goes to somewhere else
app.use(errorHandler)   // if that raise an error then we just showcase the error

PORT = process.env.PORT || 5000 // just in case if our port is not available in the env file

const server = app.listen(PORT, (err)=>{
    if(err) console.error(err)
    else console.log(`Server Started on port ${PORT}`)
})

const io = require('socket.io')(server, {cors:{
    pingTimeout: 60000, // this means that it will wait for 60s and goes off if it didnt get any request
    origin: 'http://localhost:3000'
}})

io.on("connection", (socket)=>{     // notice that all the inner sockets only apply if the main socket is connected
    console.log("Connected to Socket.io")
    socket.on('setup', (userData)=>{    // what happens here is that we create a new socket where the frontend will send data and will join the socket server (room)
        socket.join(userData._id)   // now we're gonna create a new room with the user id so that others can join the room
        socket.emit('connected')    // The Socket.IO API is inspired from the Node.js EventEmitter, which means you can emit events on one side and register listeners on the other
    })

    socket.on('join chat', (room)=>{    // there are more like the seperate routes in the express server but the seperate rooms of the socket
        socket.join(room)
        console.log("User joined Room: " + room)
    })

    socket.on('typing', (room)=>{
        socket.in(room).emit("typing")
    })

    socket.on('stop typing', (room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on('new message', (newMessage)=>{
        var chat = newMessage.chat
        if(!chat.users) return console.log("Chat.users is empty / undefined")
        chat.users.forEach(user=>{
            if(user._id == newMessage.sender._id) return    //  you dont have to send the same message to the sender again trust me it was confusing to get the same message sent to me so dont forget this part
            socket.in(user._id).emit('message recieved', newMessage) // io.sockets.in broadcasts to all sockets in the given room. In simple send the message/data inside the user's room
        })
    })

    socket.off('setup', ()=>{
        console.log("User Disconnected")
        socket.leave(userData._id)
    })
})