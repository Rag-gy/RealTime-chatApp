import { Box } from '@chakra-ui/react'
import React from 'react'

const UserTag = ({user, handleFunction}) => {   // here in this way you can derefernce the props to access easier

return (
    <Box display="flex" justifyContent="center" flexDir="row" px={2} py={1} borderRadius="lg" m={1} mb={2} variant="solid" fontSize={12} backgroundColor="blue.200" cursor="pointer" onClick={handleFunction}>
        {user.name}
        <i className="fa-solid fa-xmark" style={{width:"15px", height:"10px", marginLeft:"10px"}} />
    </Box>
    )
}

export default UserTag