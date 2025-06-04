import React, { useState } from "react";
import {
  useSendMessageMutation,
  useDeleteConversationMutation,
  useGetConversationsByUserQuery,
} from "./inboxSlice"; // make sure you have this
import {
  Box,
  HStack,
  Image,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../../components/custom/button";
import { FaPaperPlane, FaPlus, FaTrash } from "react-icons/fa6";
import { ErrorToast, SuccessToast } from "../../components/toaster";
import {
  formatDate,
  formatSingleDate,
  formatTime,
} from "../../components/custom/dateFormat";
import { useGetAllUsersQuery } from "../login/loginSlice";
import CustomInputs from "../../components/custom/input";
import SearchInput from "../../components/custom/search";

const Message = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setsearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useGetConversationsByUserQuery();

  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteConversationMutation();

  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleDelete = async (conversationId) => {
    try {
      if (!conversationId) return;
      const response = await deleteMessage({ conversationId }).unwrap();
      SuccessToast(response.message);
    } catch (error) {
      ErrorToast(error?.data?.message || "Something went wrong");
    }
  };

  const handleStartConversation = async () => {
    try {
      if (!message || !selectedUser) return;
      const payload = {
        receiverId: selectedUser._id,
        content: message,
      };
      const response = await sendMessage(payload).unwrap();
      SuccessToast(response.message);
      setMessage("");
      setsearchTerm("");
      setSelectedUser(null);
      onClose();
    } catch (error) {
      const errorMessage = error.data.message || "failed to send message";
      ErrorToast(errorMessage);
    }
  };

  const handleSearch = (e) => {
    setsearchTerm(e.target.value);
  };
  const handleConversationSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const filterUsers = (users, searchTerm) => {
    if (!searchTerm) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const filterMessages = (conversations, searchQuery) => {
    if (!searchQuery) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.lastMessage.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.receiverId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.senderId.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const filteredData = filterUsers(users, searchTerm);
  const filteredConversations = filterMessages(conversations, searchQuery);
  return (
    <Box p={{ base: 2, md: 5 }} w={{ base: "100%", md: "90%" }} h="90vh">
      <HStack
        justifyContent="space-between"
        alignItems="center"
        w={{ base: "100%", md: "70%" }}
      >
        <CustomButton
          onClick={onOpen}
          // top={"100%"}
          // bottom={"10%"}
          bgColor={"blue.400"}
          leftIcon={<FaPlus />}
          title={"Add Conversation"}
        />
        <SearchInput
          value={searchQuery}
          width={"70%"}
          onChange={handleConversationSearch}
          placeholder={"search ... "}
        />
      </HStack>
      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setSelectedUser(null);
          setMessage("");
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          position="absolute"
          bottom={{ base: "0", md: "10" }}
          left={{ base: "0", md: "70%" }}
          right="0"
          m="auto"
          borderTopRadius="xl"
          maxW={{ base: "100%", md: "20%" }}
          h={{ base: "50%", md: "70%" }}
        >
          <ModalHeader>
            <VStack>
              <Text>Start a New Conversation</Text>
              <SearchInput
                value={searchTerm}
                width={"100%"}
                onChange={handleSearch}
                placeholder={"search user to start conversation... "}
              />
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            overflowY={"scroll"}
            sx={{
              scrollbarWidth: "none",
              "&::webkit-scroll": {
                display: "none",
              },
            }}
          >
            {!selectedUser ? (
              <VStack align="stretch" spacing={3}>
                {loadingUsers ? (
                  <Spinner size="sm" />
                ) : (
                  filteredData?.map((user) => (
                    <HStack
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "gray.100", cursor: "pointer" }}
                    >
                      <Avatar
                        src={user.photo}
                        name={user.name}
                        size={{ base: "sm", md: "md" }}
                      />
                      <Text>{user.name}</Text>
                      <Text
                        fontSize={"sm"}
                        color={
                          user.role === "admin"
                            ? "green.400"
                            : user.role === "parent"
                            ? "red.200"
                            : user.role === "teacher"
                            ? "blue.400"
                            : user.role === "student"
                            ? "gray.300"
                            : "white"
                        }
                      >
                        ({user.role})
                      </Text>
                    </HStack>
                  ))
                )}
              </VStack>
            ) : (
              <Box>
                <HStack mb={3}>
                  <Avatar
                    src={selectedUser.photo}
                    name={selectedUser.name}
                    size={{ base: "sm", md: "md" }}
                  />
                  <Text fontWeight="bold">{selectedUser.name}</Text>
                </HStack>
                <CustomInputs
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  placeholder={"Type your message..."}
                />
              </Box>
            )}
          </ModalBody>

          {selectedUser && (
            <ModalFooter gap={3}>
              <CustomButton
                onClick={() => setSelectedUser(null)}
                size={"md"}
                bgColor={"#EF8F02"}
                title={"Back"}
              />
              <CustomButton
                onClick={handleStartConversation}
                disabled={isSending}
                leftIcon={<FaPaperPlane />}
                size={"md"}
                bgColor={"blue.400"}
                title={isSending ? "Sending..." : "Send"}
              />
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      {/* Existing Messages List */}
      {isLoading ? (
        <Spinner size={"sm"} />
      ) : error ? (
        <Text>Error loading messages</Text>
      ) : (
        <Box
          p={{ base: 2, md: 2 }}
          w={"100%"}
          h={"100%"}
          overflow={"auto"}
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {filteredConversations?.length > 0 ? (
            filteredConversations?.map((msg) => (
              <Box
                key={msg._id}
                borderRadius="5px"
                w={"100%"}
                // bg={colorMode === "light" ? "gray.200" : "gray.700"}
                pl={{ base: "0%", md: "10%" }}
                pr={{ base: "0%", md: "10%" }}
                mb={2}
                _hover={{
                  cursor: "pointer",
                  bgColor: colorMode === "dark" ? "gray.600" : "gray.100",
                }}
              >
                <HStack justifyContent="space-between" fontSize="sm">
                  <Text>{formatSingleDate(msg.lastMessage.timestamp)}</Text>
                </HStack>
                <HStack
                  w={"100%"}
                  onClick={() => {
                    const senderId = msg.lastMessage.senderId._id;
                    const receiverId = msg.lastMessage.receiverId._id;
                    const photo = msg.lastMessage.receiverId.photo;
                    const receiverName = msg.lastMessage.receiverId.name;
                    const sortedIds = [senderId, receiverId].sort();
                    const conversationId = sortedIds.join("_");
                    // navigate(`/inbox/${conversationId}/${receiverName}/${photo}`,);

                    navigate(
                      `/inbox/${conversationId}?receiverName=${encodeURIComponent(
                        receiverName
                      )}&photo=${encodeURIComponent(photo)}`
                    );
                  }}
                >
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    overflow="hidden"
                    bg="gray.300"
                  >
                    <Avatar
                      src={msg.lastMessage.receiverId.photo}
                      name={msg.lastMessage.receiverId.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                  </Box>
                  <VStack
                    about="flex-start"
                    alignItems="flex-start"
                    w={"100%"}
                    lineHeight={"base"}
                  >
                    <strong>{msg.lastMessage.receiverId.name}</strong>

                    <HStack justifyContent="space-between" w="100%">
                      <Text fontSize="sm">
                        {msg.lastMessage.content.length > 40
                          ? msg.lastMessage.content.slice(0, 40) + "..."
                          : msg.lastMessage.content}
                      </Text>
                      <HStack justifyContent={"space-between"}>
                        <Text>{formatTime(msg.lastMessage.timestamp)}</Text>

                        {isDeleting ? (
                          <Spinner size="xs" />
                        ) : (
                          <Box onClick={() => handleDelete(msg._id)}>
                            <FaTrash size={16} />
                          </Box>
                        )}
                      </HStack>
                    </HStack>
                  </VStack>
                </HStack>

                {filteredConversations.length > 0 && (
                  <Box
                    border={"1px solid "}
                    mt={2}
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.100"}
                  ></Box>
                )}
              </Box>
            ))
          ) : (
            <Text bottom={"0%"} textAlign="center" mt={"20%"} color="gray.500">
              <Link onClick={onOpen}>
                {" "}
                No Conversations yet. Start the conversation!
              </Link>
            </Text>
          )}
        </Box>
      )}

      {/* Add Conversation Button */}
    </Box>
  );
};

export default Message;
