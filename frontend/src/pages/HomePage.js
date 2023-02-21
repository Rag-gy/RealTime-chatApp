import React, { useEffect } from 'react'
import {Box, Container, Text, Tabs, TabList, Tab, TabPanels, TabPanel} from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useHistory } from 'react-router-dom'

const HomePage = () => {


    const history = useHistory()

    useEffect(()=>{
        const currUser = JSON.parse(localStorage.getItem('userInfo'))

        if(currUser){
            history.push("/chat")
        }
    }, [history])


    return (// here the maxW denotes the maximum width and the centerContent centeres the elements within the container
    <Container maxW='xl' centerContent>
        <Box d='flex' justifyContent="center" textAlign={"center"} p={3} w="100%" m="40px 0 15px 0" borderRadius="xl" borderWidth="1px" bg={"white"}> {/*We chose the Box element which is similar to div but not div because we can style the bos element via chakra UI*/}
            <Text fontSize='2xl' fontFamily="Itim" fontWeight='bold' color="gray.900">Talk Aloud</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="xl" borderWidth="1px">
            <Tabs>
                <TabList mb="1em"> {/* the mb denotes the margin bottom */}
                    <Tab width="50%">Login</Tab>
                    <Tab width="50%">Sign Up</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                    <Login />
                    </TabPanel>
                    <TabPanel>
                    <SignUp />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
    )
}

export default HomePage