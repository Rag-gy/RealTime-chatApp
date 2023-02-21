import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// the createContext is used to share the context between components

// One important thing Make sure to Name your react component with a capital letter at first as it is important and leads to alot of errors if not given

const ChatContext = createContext()

const ChatProvider = ({children})=>{

    const [user, setUser] = useState()
    const[SelectedChat, setSelectedChat] = useState()
    const[chats, setChats] = useState([])
    const[notification, setNotification] = useState([])

    const history = useHistory()

    // console.log(chats)

    useEffect(()=>{
        const currUser = JSON.parse(localStorage.getItem('userInfo'))    // this is to get the user information stored in the localStorage
        setUser(currUser)

        if(!currUser){  // if there is no currently logged in user
            history.push("/")    // we redirect to the login page 
        }   
    }, [history])

    return (
        <ChatContext.Provider value={{user, setUser, SelectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
            {children}
        </ChatContext.Provider> // this will create a context provider which will return the values 
    );
}

export const ChatState = ()=>{
    return useContext(ChatContext)
}

export default ChatProvider;