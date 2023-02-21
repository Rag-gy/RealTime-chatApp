import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/DataContext'
import {ArrowBackIcon} from '@chakra-ui/icons'
import { getSender, getSenderFull } from './ChatLogic'
import ProfileBox from './ProfileBox'
import UpdateGroupChat from './UpdateGroupChat'
import axios from 'axios'
import '../styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import animationData from './typing.json'
import gif from './typing.gif'

const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare;

const SingleChat = ({reRender, setRerender}) => {

    const {user, SelectedChat, setSelectedChat, notification, setNotification} = ChatState()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toast = useToast()

    const fetchMessage = async()=>{
        if(!SelectedChat)return
        try {
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data} = await axios.get(`/message/${SelectedChat._id}`, config)
            setMessages(data)
            setLoading(false)
            socket.emit('join chat', SelectedChat._id)  // we send the data to the join chat socket
        }
        catch (error) {
            toast({
                title:'Error Occured!',
                status:'Error',
                isClosable: true,
                duration: 3000,
                position:'bottom'
            })
        }
    }

    useEffect(()=>{
        socket = io(ENDPOINT)   // this is the client side of the socket
        socket.emit('setup', user)    // this emit is where you send the data to the setup room that you've created when a server is created and the socket is connected
        socket.on('connected', ()=>{setSocketConnected(true)}) // when we connect to the socket server we then rerender the object
        socket.on('typing', ()=>{setIsTyping(true)})
        socket.on('stop typing', ()=>{setIsTyping(false)})
    }, [])

    // console.log(notification, "-*-*-*-*-*-*-*-*-*-*-*-*-*-") 

    useEffect(()=>{
        socket.on('message recieved', (newMessage)=>{
            if(!selectedChatCompare || selectedChatCompare._id != newMessage.chat._id){   // if our selectedChatCompare is empty, then it means none of the chats are selected
                //   also if the message is not from the selected chat then we dont show it and render the page
                if(!notification.includes(newMessage)){
                    setNotification([newMessage, ...notification])
                    setRerender(!reRender)
                }
            }
            else{
                setMessages([...messages, newMessage])
            }
        })
    })   // here we haven't given the parameter so what useEffect does is it performs the function provided everytime when the state changes

    const sendMessage = async(e)=>{
        if(e.key === 'Enter' && newMessage){
            socket.emit('stop typing', SelectedChat._id)
            try {
                const config = {
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const {data} = await axios.post('/message', {
                    content:newMessage,
                    chatId:SelectedChat._id
                }, config)
                socket.emit('new message', data)
                setNewMessage("")// to give empty message after sending a message
                setMessages([...messages, data])
            }
            catch (error) {
                toast({
                    title:'Error Occured!',
                    status:'Error',
                    isClosable: true,
                    duration: 3000,
                    position:'bottom'
                })
            }
        }
    }


    const TypingHandler = (e)=>{
        setNewMessage(e.target.value)

        // Typing Logic
        if(!socketConnected) return // if the socket is disconnected, then it doesnt matter if you type

        if(!typing){
            setTyping(true)
            socket.emit('typing', SelectedChat._id)
        }
        // now to stop the typing when the time ends

        let LastTypedTime = new Date().getTime()
        let TimerLength = 2000

        setTimeout(()=>{
            var TimeNow = new Date().getTime()
            let difference = TimeNow - LastTypedTime

            if(difference >= TimerLength && typing){
                socket.emit('stop typing', SelectedChat._id)
                setTyping(false)
            }
        }, TimerLength)
    }

useEffect(()=>{
    fetchMessage()
    selectedChatCompare = SelectedChat  // here we backup the currently selected chat so we can compare the data and perform the necessary actions
}, [SelectedChat])


    return (
    <>
        {SelectedChat? 
        (<>
            <Box fontSize={{base:"28px", md:"30px"}} pb={3} px={2} fontFamily="monospace" display="flex" justifyContent='space-between'>
            <IconButton display={{base:'flex', md:'none'}} p='3' right="8vw" icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat('')} />
            {!SelectedChat.isGroupChat? (
            <>
                {getSender(user, SelectedChat.users)}   {/* In case you wonder what this is for, it is used to find the person who is in chat with the admin */}
                <ProfileBox user={getSenderFull(user, SelectedChat.users)} />
            </>
            ):
                (<>{SelectedChat.chatName}
                <UpdateGroupChat reRender={reRender} setRerender = {setRerender} fetchMessage = {fetchMessage} />
                </>)}
            </Box>
            <Box display='flex' flexDir='column' justifyContent='flex-end' p={3} bg='#E8E8E8' width='100%' height='100%' borderRadius='lg' overflowY='hidden'>
                {loading?(
                    <Spinner size='xl' width={20} height={20} alignSelf='center' margin='auto'/>
                ):(<div className="messages">
                    {/* Message */}
                    <ScrollableChat messages = {messages}/>
                </div>)}
                <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                    {isTyping?<div>
                        <img src={gif} alt="loading" width={50} style={{marginBottom: 15, marginLeft: 0, height:"100px", width:"100px"}}/>
                    </div>:<></>}
                    <Input variant='filled' bg="#E0E0E0" placeholder='Enter a Message...' onChange={TypingHandler} value={newMessage}/>
                </FormControl>
            </Box>
        </>):
        (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="3xl" pb={3} fontFamily="monospace">
                    Click on a User to Start Chatting
                </Text>
            </Box>
        )}
    </>
    )
}

export default SingleChat