import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useToast } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ChatState } from '../context/DataContext'
import ProfileBox from './ProfileBox'
import ChatLoading from '../context/chatLoading'
import axios from 'axios'
import UserListItem from './UserListItem'
import { getSender } from './ChatLogic'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


const SideDrawer = () => {

    const [search, setSeacrh] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const[loading, setLoading] = useState(false)
    const[loadingChat, setLoadingChat] = useState();

    const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState()
    const history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure() // useDisclosure is a is a custom hook used to help handle common open , close , or toggle scenarios.
    const toast = useToast()

    const Logout = ()=>{
        localStorage.removeItem('userInfo')
        history.push("/")
    }

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

    const handleSearch = async ()=>{
        if(!search){
            toast({
                title: "Enter Something",
                status:"warning",
                isClosable: true,
                duration: 5000,
                position: 'top-left'
            })
            return
        }
        try {
            setLoading(true)
            const config = {    // you have to give this config while using axios
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.get(`/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
            return
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load the search results',
                isClosable: true,
                duration: 3000,
                position:'bottom-left'
            })
            return
        }
    }

    const accessChat = async (userId)=>{
        try {
            setLoading(true)
            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.post('/chat', {userId}, config)
            if(!chats.find((c)=>{return c._id == data._id})){
                setChats([data, ...chats]);
            }
            console.log("This si data...", data)
            setSelectedChat(data)
            fetchChats()
            setLoading(false)
            onClose()
        }
        catch (error) {
            toast({
                title:"Error fetching chat",
                description: error.message,
                isClosable: true,
                duration: 3000,
                position:'bottom-left',
                status: 'error',
            })
        }
    }

return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" p="5px 10px 5px 10px" borderWidth="5px">
        <Tooltip label="Search Chat to conversate" hasArrow bg="gray.300" placement='bottom-end' color="black">
            <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{base:"none", md:"flex"}} px="4">Search User</Text>
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="monospace">Chit-Chat</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <NotificationBadge count = {notification.length} effect={Effect.SCALE} />
                    <i className="fa-solid fa-bell" style={{fontSize:"150%", margin:"10"}}></i>
                </MenuButton> 
                {/* I have to say it I'm deeply impressed by the chakra UI it just blows my mind */}
                <MenuList pl={3}>
                    {!notification.length && "No New Messages Available"}
                    {notification.map(notif=>(
                        <MenuItem key={notif._id} onClick={()=>{
                            setSelectedChat(notif.chat)
                            setNotification(notification.filter((nots)=>nots!=notif))}}>
                        {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user, notif.chat.users)}`}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} 
                rightIcon={<i className="fa-solid fa-angle-down"></i>}>
                    <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
                </MenuButton>
                <MenuList>
                    <ProfileBox user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileBox>
                    <MenuItem onClick={Logout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>
    
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
            <DrawerBody>
                <Box display="flex" pb={2}>
                    <Input placeholder='Search by Name/Email' mr={2} value={search} onChange={(e)=>{setSeacrh(e.target.value)}}></Input>
                    <Button onClick={handleSearch}>GO</Button>
                </Box>
                {loading ? (<ChatLoading />):(
                    searchResult?.map(user=>(
                        <UserListItem 
                        key={user._id} 
                        user={user} 
                        handleFunction ={()=>accessChat(user._id)}/>
                        )
                    )
                )}
                {loadingChat && <Spinner display="flex" ml="auto"/>}
            </DrawerBody>
        </DrawerContent>
    </Drawer>
</>
)
}

export default SideDrawer