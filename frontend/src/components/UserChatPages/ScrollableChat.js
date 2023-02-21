import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'  
import { ChatState } from '../context/DataContext'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ChatLogic'

const ScrollableChat = ({messages}) => {


    const {user} = ChatState()

    return (
    <ScrollableFeed>    {/* This Scrollable feed is what I've did manually in my selenium project. Remember when I used to scroll the required pages automatically via js, well now that you have this
    this will automatically scroll the element to the last if a new message arrives only if it is in the end initially */}
        {messages && messages.map((m, i)=>(
            <div style={{display:"flex"}} key={m._id}>
                {
                    (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && 
                    (<Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                        <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic}></Avatar>
                    </Tooltip>)    // if the above conditions satisfy then the current component in the line will run
                }
                <span style={{backgroundColor:`${m.sender._id == user._id ? "#BEE3F8":"#B9F5D0" }`, borderRadius:"20px", padding:"5px 15px", maxWidth:"75%", marginLeft: isSameSenderMargin(messages, m, i, user._id), marginTop: isSameUser(messages, m, i)? 3:10,}}>
                    {m.content}
                </span>
            </div>
        ))}
    </ScrollableFeed>
    )
}

export default ScrollableChat