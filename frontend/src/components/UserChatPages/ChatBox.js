import { Box } from '@chakra-ui/react'
import React from 'react'
import {ChatState} from '../context/DataContext'
import SingleChat from './SingleChat'

const ChatBox = ({reRender, setRerender}) => {

    const {SelectedChat} = ChatState()

return (
    <>
        <Box display = {{base:SelectedChat?"flex":'none', md:'flex'}}
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        width = {{base:"100%", md:"68%"}}
        borderRadius="lg"
        borderWidth="1px">
            <SingleChat reRender = {reRender} setRerender = {setRerender} />
        </Box>
    </>
)
}

export default ChatBox