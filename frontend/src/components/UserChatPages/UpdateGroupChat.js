import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/DataContext'
import UserListItem from './UserListItem'
import UserTag from './userTag'

const UpdateGroupChat = ({reRender, setRerender, fetchMessage}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const [groupName, setGroupName] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [renameLoading, setRenameLoading] = useState(false)
    const[loading, setLoading] = useState(false)
    const[search, setSearch] = useState("");

    const toast = useToast()

    const {user, SelectedChat, setSelectedChat} = ChatState()

    const handleAddUser = async(user1)=>{   
        if(SelectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title:'User Already in Group',
                duration: 3000,
                isClosable: true,
                position:'bottom'
            })
            return
        }

        console.log(SelectedChat)

        if(SelectedChat.groupAdmin._id !== user._id){
            toast({
                title:'Only Admin can add user',
                isClosable: true,
                duration: 3000,
                position: 'bottom',
                status:'error'
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('/chat/groupadd', {chatId:SelectedChat._id, userId: user1._id}, config)
            setSelectedChat(data)
            setRerender(!reRender)
            setLoading(false)

        } catch (error) {
            toast({
                title:'Error Occured',
                description: error.response.data.message,
                isClosable: true,
                duration: 3000,
                position: 'bottom',
                status: 'error'
            })
        }
    }

    const handleRename = async()=>{
        if(!groupName) return

        try {
            setRenameLoading(true)

            const config = {
                headers:{Authorization: `Bearer ${user.token}`}
            }

            const {data} = await axios.put('/chat/rename', {
                chatId:SelectedChat._id,
                chatName:groupName}, config)
            
            setSelectedChat(data)
            setRerender(!reRender)
            setRenameLoading(false)
        }
        catch (error) {
            toast({
                title:'Error Occured',
                description: error.response.data.message,
                status:'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setRenameLoading(false)
        }
        setGroupName('')    // well you might be confused on why empty assigning here right? Simple you want an empty read input so you clean it as it is the input you get from the user to change the group name
    }

    const handleSearch = async (query)=>{
        setSearch(query)
        if(!query){
            return  // if the search bar is null we wont render anything so just return
        }
    
        try {
            setLoading(true)  // we give the setLoading as True as we have to showcase that we are searching
            const config = {  // take a copy of this as this is used alot of time and have to type without any mistake
            headers:{
                Authorization: `Bearer ${user.token}`
            },
        }
            const {data} = await axios.get(`/user?search=${search}`, config)  // in case you've lost flow this is the search function we've written in the DataContext file. I know many files may confuse us but trust me I've been confused sometimes too
            setSearchResult(data)
            setLoading(false)
        }
    
        catch (error) {
            toast({
            title:"Error Occured!",
            isClosable:true,
            description:"Failed to load search results",
            status:"error",
            duration:3000,
            position:"bottom-left"
            })
        }
    }

    const handleRemove = async(user1)=>{
        if(SelectedChat.groupAdmin._id !== user._id){
            toast({
                title:'Only Admin can remove user',
                isClosable: true,
                duration: 3000,
                position: 'bottom',
                status:'error'
            })
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put('/chat/groupremove', {chatId:SelectedChat._id, userId: user1._id}, config)
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setRerender(!reRender)
            fetchMessage()
            setLoading(false)
        } 
        catch (error) {
            toast({
                title: 'Error Occured',
                description: error.reponse.data.message,
                isClosable: true,
                duration: 3000,
                position: 'bottom',
                status:'error'
            })
        }
    }

return (
    <>
        <IconButton display='flex' icon={<ViewIcon />} onClick={onOpen} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader fontSize='35px' fontFamily='monospace' display='flex' justifyContent='center'>{SelectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box width='100%' display='flex' flexWrap='wrap' pb={3}>
                    {SelectedChat.users.map(u=>(<UserTag key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>))}
                </Box>
                <FormControl display='flex'>
                    <Input placeholder='Set Chat Name' mb={3} value = {groupName} onChange = {(e)=>{setGroupName(e.target.value)}}/>
                    <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                </FormControl>
                <FormControl>
                    <Input placeholder='Add Users to Group' mb={1} onChange={(e)=>  handleSearch(e.target.value)}/>
                </FormControl>
                {loading ? (<Spinner size='lg'/>):(searchResult?.map((user)=>(<UserListItem key={user._id} user={user} handleFunction = {()=>handleAddUser(user)}/>)))}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
                    Leave Group
                </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
    )
}

export default UpdateGroupChat