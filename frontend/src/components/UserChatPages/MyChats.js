import { Box, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/DataContext'
import ChatLoading from '../context/chatLoading'
import { getSender } from './ChatLogic'
import GroupChatModal from './GroupChatModal'


const MyChats = ({reRender}) => {

    console.log("My chat rendered")

    const [loggedUser, setLoggedUser] = useState()

    const {user, SelectedChat, setSelectedChat, chats, setChats} = ChatState()

    const toast = useToast()

    const fetchChats = async ()=>{
        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }

            const {data} = await axios.get('/chat', config)
            setChats(data);

        }
        catch(err){
            toast({
                title:"Error Occured bruh",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }


    useEffect(()=>{
        const currUser = JSON.parse(localStorage.getItem('userInfo'))
        setLoggedUser(currUser)
        fetchChats()
    }, [reRender])

return (
    <Box 
    display = {{base:SelectedChat ? "none":"flex", md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    width = {{base:"100%", md:"31%"}}
    borderRadius="lg"
    borderWidth="1px">
        <Box
        pb={3}
        px={3}
        fontSize={{base:"28px", md:"30px"}}
        fontFamily="monospace"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center">My Chats
        <GroupChatModal>
        
        </GroupChatModal>
        </Box>

        <Box display="flex" flexDir="column" p={3} bg="#F8F8F8" width="100%" height="85%" borderRadius="lg" overflowY="hidden">
            {chats ? (
                <Stack overflowY="scroll">
                    {chats.map((chat)=>(
                        <Box onClick={()=>{setSelectedChat(chat)}}
                        cursor="pointer"
                        bg={SelectedChat === chat ? "#38B2AC":"#E8E8E8"}
                        color={SelectedChat === chat ? "white":"black"}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        key={chat._id}>
                            <Text>
                                {!chat.isGroupChat?(getSender(loggedUser, chat.users)):(chat.chatName)}  
                            </Text>
                        </Box>
                    ))}
                </Stack>
            ):(<ChatLoading/>)}
        </Box>
    </Box>
)
}

export default MyChats