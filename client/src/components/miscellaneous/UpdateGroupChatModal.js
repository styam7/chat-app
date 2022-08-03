import { ViewIcon } from '@chakra-ui/icons'
import { Box, IconButton, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const toast = useToast()
    const { selectedChat, setSelectedChat, user } = ChatState()

    const handleRemove = () => { }

    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameloading(true)

            const { data } = await axios.put('/chat/rename',
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                }
            )
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameloading(false)
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameloading(false);
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!search) {
            return;
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`/users/?search=${search}`)
            setSearchResult(data)
            setLoading(false)
            console.log(data)
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleAddUser = async (userToAdd) => {
        if(selectedChat.users.find((u) => u._id === userToAdd._id)){
            toast({
                title: "User already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }
        if(selectedChat.groupAdmin._id !== user._id ){
            toast({
                title: "Only Admins can add someone",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }
        try {
            setLoading(true)

            const { data } = await axios.put('/chat/groupAdd', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            })
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
    }
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName.toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add users to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? <Spinner size="md" /> :
                            (
                                searchResult.slice(0, 4).map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal