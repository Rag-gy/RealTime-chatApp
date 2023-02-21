import { Box } from "@chakra-ui/react"
import { useState } from "react"
import { ChatState } from "../components/context/DataContext"
import ChatBox from "../components/UserChatPages/ChatBox"
import MyChats from "../components/UserChatPages/MyChats"
import SideDrawer from "../components/UserChatPages/SideDrawer"

const ChatPage = () => {

    const {user} = ChatState()
    const [reRender, setRerender] = useState(false)

    return (
    <div style={{width:"100%"}}>
        {user && <SideDrawer />}    {/* here the && denotes that if the user is not null then we have to create the drawer, so by anding true && 1 we get 1 now you know
        this can also be written as user ? <SideDrawer/>:<></> */}
        <Box display="flex" justifyContent="space-between " width="100%" h="90vh" p="10px">
            {user && <MyChats reRender={reRender}/>}
            {user && <ChatBox reRender={reRender} setRerender = {setRerender}/>}
        </Box>
    </div>
    )
}

export default ChatPage