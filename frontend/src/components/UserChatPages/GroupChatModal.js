import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../context/DataContext'
import UserListItem from './UserListItem'
import UserTag from './userTag'

const GroupChatModal = ({children}) => {

  const[groupChatName, setGroupChatName] = useState()
  const[selectedUsers, setSelectedUsers] = useState([])
  const[search, setSearch] = useState("")
  const[searchResult, setSearchResult] = useState([])
  const[loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {user, chats, setChats} = ChatState()

  const handleSubmit = async()=>{
    if(!groupChatName || !selectedUsers){
      toast({
        title: "Please Fill all the fields",
        status:'warning',
        isClosable: true,
        duration: 3000,
        position:'top'
      })
      return
    }
    try{
      const config = {
        headers:{
          Authorization: `Bearer ${user.token}`
        },
      }

      const {data} = await axios.post('/chat/group', {
        name:groupChatName,
        users: JSON.stringify(selectedUsers.map((u)=>(u._id)))
      }, config)
      // console.log(data)
      setChats([data, ...chats])
      console.log("crossed setChats")
      onClose()
      toast({
        title:"New group chat created",
        status: "success",
        isClosable: true,
        duration: 3000,
        position: "bottom",
      })
    }
    catch(err){
      console.log(err.message)
      toast({
        title:"Failed to create group chat",
        isClosable : true,
        duration: 3000,
        position: "bottom",
        status:'error'
      })
    }
  }

  const toast = useToast()


  const handleGroup = (selectedUser)=>{
    if(selectedUsers.includes(selectedUser)){
      toast({
        title:"User already in the group",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        posiiton:'top',
      })
      return;
    }
    setSelectedUsers(prev => [...prev, selectedUser])
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

  const handleDelete = (userToDelete)=>{
    setSelectedUsers(selectedUsers.filter(users => users._id !== userToDelete._id))
  }

  return (
    <>
      <Button
          display="flex"
          fontSize={{base:"17px", md:"10px", lg:"17px"}}
          onClick={onOpen}
          rightIcon={<i className="fa-solid fa-plus" style={{fontSize:"20px"}}></i>}
          >
          New Group Chat
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="20px"
          fontFamily="monospace"
          display="flex"
          justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder='Group Name' mb={3} onChange = {(e)=>setGroupChatName(e.target.value)}/> {/* In case you dont know the onchange function passes an event object which contains the target and in target.value the data you entered is stored */}
            </FormControl>
            <FormControl>
              <Input placeholder='Search Users' mb={1} onChange = {(e)=>handleSearch(e.target.value)}/> 
            </FormControl>

          {/* Here the list of users which fall under search will be rendered */}

          <Box display="flex" flexDir="row" width="100%" flexWrap="wrap">
            {selectedUsers.map((u)=>(<UserTag key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>))}
          </Box>

          {loading?<div>loading</div>:
          (searchResult?.slice(0, 4).map((users)=><UserListItem key={users._id} user={users} handleFunction={()=>handleGroup(users)} />))
          }

          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal