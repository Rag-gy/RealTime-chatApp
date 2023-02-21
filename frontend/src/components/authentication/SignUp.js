import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'   // this useHistory is more like a ledger which holds the data of the page you've been before and the pages you've gone and came back whic can be used to redirect to the pages you've been to
import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setMail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [picture, setPicture] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const showpass = ()=>{setShow(!show)}

    const PostImage = (pic)=>{
        
        setLoading(true)
        if(pic === undefined){
            setLoading(false)
            toast({
                title: 'Please select a picture',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return
        }
        if(pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg"){
            const data = new FormData() // this is more like a key value pair
            data.append("file", pic)
            data.append("upload_preset", "chat app")    // it is the preset-name given 
            data.append("cloud_name", "dqkyquvop")  // it is the cloud name which is used
            fetch("https://api.cloudinary.com/v1_1/dqkyquvop/image/upload",{
                method:'post', body:data
            }).then(res => res.json())
            .then(data =>{
                setPicture(data.url.toString())
                setLoading(false)
            })
            .catch((err)=>{
                console.error(err)
                setLoading(false)})
        }
        else{
            setLoading(false)
            toast({
                title: 'Please select a picture',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return
        }
    }

    const submitHandler = async (e)=>{
        setLoading(true);
        if (!name || !email || !password || !confirmPassword){
            toast({
                title:'Please Fill All The Fields',
                status: 'warning',
                duration: 1500,
                isClosable: true,
                position:'bottom',
            });
            setLoading(false);
            return 
        }
        if(password !== confirmPassword){
            toast({
                title:`Passwords Do Not Match`,
                status: 'warning',
                duration: 1500,
                isClosable: true,
                position:'bottom',
            });
            setLoading(false);
            return 
        }
        try {
            const config = {    // this is for the configuration of the request (API requests)
                headers:{
                    "Content-Type": "application/json",
                }
            }
            const {data} = await axios.post("/user", {name, email, password, picture}, config)    // this axios is a js framework used for sending and recieving request in a simple way 

            toast({
                title:'Registration Successful',
                status: 'success',
                duration: 1500,
                isClosable: true,
                position:'bottom',
            });

            localStorage.setItem('userInfo', JSON.stringify(data))  // in local storage we store the currently logged user data
            setLoading(false)
            history.push('/chat'); // history.push(url) will push the url to the history stack and will redirect to the url given
        }
        catch (error) {
            toast({
                title:'Registration Error',
                status: 'error',
                duration: 1500,
                isClosable: true,
                position:'bottom',
            });
            setLoading(false);
        }
    }


        return (
    // Stack is used to group elements together and apply a space between them. Vstack is used to stack elements in the vertical direction
    <VStack spacing='5px' color="black"> {/* here spacing denotes space along y axis */}
        <FormControl id='name' isRequired> {/* Form Control provides context such as `isInvalid`, `isDisabled`, and `isRequired` to form elements inshort more like forms*/}
            <FormLabel>Name</FormLabel>
            <Input placeholder='Username' onChange={(event)=>{
                setName(event.target.value);
            }}/>
        </FormControl>
        <FormControl id='email' isRequired> {/* Form Control provides context such as `isInvalid`, `isDisabled`, and `isRequired` to form elements inshort more like forms*/}
            <FormLabel>Email</FormLabel>
            <Input placeholder='Email' onChange={(event)=>{
                setMail(event.target.value);
            }}/>
        </FormControl>

        <FormControl id='password' isRequired> {/* Form Control provides context such as `isInvalid`, `isDisabled`, and `isRequired` to form elements inshort more like forms*/}
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input placeholder='Password' type={show?"text":"password"} onChange={(event)=>{
                setPassword(event.target.value);
            }}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={showpass}>
                    {show ? "Hide" : "Show"}    {/* show here is the value in the useState */}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='confirmPassword' isRequired> {/* Form Control provides context such as `isInvalid`, `isDisabled`, and `isRequired` to form elements inshort more like forms*/}
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input placeholder='Confirm password' type={show?"text":"password"} onChange={(event)=>{
                setConfirmPassword(event.target.value);
            }}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={showpass}>
                    {show ? "Hide" : "Show"}    {/* show here is the value in the useState */}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="photo">
            <FormLabel>Photo</FormLabel>
            <Input 
            type="file"
            p = {1.5}
            accept = "image/*"
            onChange = {(e)=>{PostImage(e.target.files[0])}}
            />
        </FormControl>

        <Button colorScheme="green" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading = {loading}>
            Register
        </Button>
    </VStack>
    )
}

export default SignUp