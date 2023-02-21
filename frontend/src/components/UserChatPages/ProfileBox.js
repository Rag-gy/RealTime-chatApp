import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileBox = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    let img = user.pic

    if(img === undefined){
        img = user.picture
    }

return (
    <>{children ? (
        <span onClick={onOpen}>{children}</span>
    ) : (<i className="fa-solid fa-eye" onClick={onOpen} style={{display:"flex"}}></i>)
    }
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
            <ModalHeader fontSize="40px" fontFamily="monospace" display="flex" justifyContent="center">{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={img} alt={user.name} />
            <Text fontSize = {{base:'28px', md:'30px'}} fontFamily='monospace'> Email : {user.email} </Text>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
</>
)
}

export default ProfileBox