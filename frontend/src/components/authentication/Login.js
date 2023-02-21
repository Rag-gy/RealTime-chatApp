import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'

const Login = () => {
    const toast = useToast()
    const history = useHistory()
    const [name, setName] = useState()
    const [email, setMail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const showpass = ()=>{setShow(!show)}

    const submitHandler = async ()=>{
        setLoading(true)
        if(!email || !name || !password){
            toast({
                title:"Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position:"bottom"
            })
            setLoading(false)
            return;
        }

        try{
            const config = {
                headers:{"Content-Type": "application/json"}
            }
            // console.log("sent to checking")
            const {data} = await axios.post('/user/login', {name, email, password}, config)
            // console.log("crossed checking")
            toast({
                title:"User Login Successful",
                position:"bottom",
                status:"success",
                isClosable:true,
                duration: 3000,
            })
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            history.push("/chat")
        }
        catch(err){
            toast({
                title:"User Login Failed",
                description: err.response.data.message,
                status:"error",
                duration: 5000,
                isClosable:true,
            })
            setLoading(false)
        }
    }


return (
    <div>
        <VStack spacing="5px">
            <FormControl id='f-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Username" onChange={(e)=>{setName(e.target.value)}} />
            </FormControl>

            <FormControl id="mail" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Email" onChange={(e)=>{setMail(e.target.value)}} />
            </FormControl>

            <FormControl id="login-password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input placeholder='Password' type= {show?"text":"password"} onChange={(e)=>{setPassword(e.target.value)}} />
                <InputRightElement w="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showpass}>
                    {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme="green" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading = {loading}>
            Login
            </Button>
        </VStack>
    </div>
    )
}

export default Login