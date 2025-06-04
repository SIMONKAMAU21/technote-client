import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useGetMessagesInThreadQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import {
  Avatar,
  Box,
  HStack,
  Modal,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { formatDate, formatTime } from "../../components/custom/dateFormat";
import CustomInputs from "../../components/custom/input";
import CustomButton from "../../components/custom/button";
import { FaMessage, FaPaperPlane } from "react-icons/fa6";
import { ErrorToast, SuccessToast } from "../../components/toaster";
import { useGetAllUsersQuery } from "../login/loginSlice";
import { socket } from "../../../utils/socket";
import SearchInput from "../../components/custom/search";

const Conversation = () => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [newMessages, setNewMessages] = useState([]);
const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const receiverName = searchParams.get("receiverName");
  const photo = searchParams.get("photo");


  //fetching messages by conversationId
  const {
    data: existingMessages = [],
    isLoading,
    error,
  } = useGetMessagesInThreadQuery(conversationId);

  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();

  // Combine existing messages with new messages
  const allMessages = useMemo(() => {
    const combined = [...existingMessages, ...newMessages];

    // Sort by timestamp to maintain chronological order
    return combined.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [existingMessages, newMessages]);

  // Socket connection and message handling
  useEffect(() => {
    if (conversationId) {
      socket.emit("joinConversation", conversationId);
      socket.on("messageAdded", (message) => {
        // console.log("message", message);
        setNewMessages((prevMessages) => {
          // Check if message already exists to avoid duplicates
          const messageExists = prevMessages.some(
            (msg) => msg._id === message._id
          );
          if (!messageExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      });

      return () => {
        // Leave room when component unmounts or conversationId changes
        socket.emit("leaveConversation", conversationId);
        socket.off("messageAdded");
      };
    }
  }, [conversationId]);

  // Reset new messages when existing messages load
  useEffect(() => {
    if (existingMessages.length > 0) {
      setNewMessages([]);
    }
  }, [existingMessages]);

  const getReceiverIdFromConversation = (conversationId, loggedInUserId) => {
    const ids = conversationId?.split("_");
    return ids?.find((id) => id !== loggedInUserId);
  };

  //getting reciver id from conversationId
  const user = JSON.parse(localStorage.getItem("user"));
  const receiverId = getReceiverIdFromConversation(conversationId, user.id);
  const [content, setContent] = useState("");

  //scrolling to latest message
  const messageEndRef = useRef();
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]); // Changed from messages to allMessages

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const { colorMode } = useColorMode();

  const handleSend = async () => {
    if (!content.trim()) return;
    if (!content || !receiverId) {
      ErrorToast("Please enter a message and receiver ID");
      return;
    }
    try {
      const payload = {
        content,
        receiverId,
      };
      const response = await sendMessage(payload).unwrap();
      SuccessToast(response.message);
      setContent("");
      // Note: The new message will be added via socket, so no need to manually add it here
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to send message";
      ErrorToast(errorMessage);
      console.error("Send error:", err);
    }
  };

  const mentionMatches = users.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <Box
      h={"90%"}
      color={colorMode === "dark" ? "black" : "black"}
      w={{ base: "100%", md: "90%" }}
      position={"fixed"}
    >
      <HStack p={{base:1,md:2}} w={{ base: "100%", md: "50%" }} justifyContent={"space-between"}>
       <HStack spacing={2}>
         <Avatar
          name={receiverName}
          size={{ base: "sm", md: "md" }}
          src={photo}
          />
        <Text color={colorMode === "dark" ? "white" : "blackAlpha.100"} fontSize={{base:"xs",md:"md"}}>
          {receiverName}
        </Text>
       </HStack>
        <SearchInput
          // value={searchQuery}
          width={"70%"}
          // onChange={handleConversationSearch}
          placeholder={"search ... "}
        />
      </HStack>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <Box
          overflow={"auto"}
          scrollMargin={"-1"}
          h={{base:"90%",md:"85%"}}
          w={"100%"}
          pl={{ base: "0", md: "20%" }}
          pr={{ base: "0", md: "20%" }}
          pt={"0px"}
        >
          {allMessages.length > 0 ? (
            allMessages?.map((msg) => (
              <Box
                key={msg?._id}
                padding={"10px"}
                color={msg.senderId._id === user?.id ? "white" : ""}
                style={{
                  margin: "10px 0",
                  display: "flex",
                  justifyContent:
                    msg.senderId._id === user?.id ? "flex-end" : "flex-start",
                  textAlign: msg.senderId._id === user?.id ? "right" : "left",
                }}
              >
                <Box
                  bgColor={
                    msg.senderId._id === user?.id ? "#4299e1" : "#F1F0F0"
                  }
                  p={2}
                  borderRadius={10}
                  style={{
                    wordWrap: "break-word",
                  }}
                >
                  <HStack></HStack>
                  {msg?.content}
                  <Text fontSize={"10px"}>{formatTime(msg?.timestamp)}</Text>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              padding={"10px"}
              style={{
                margin: "10px 0",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Text fontSize={"sm"} color={"gray.500"}>
                No messages yet. Start the conversation!
              </Text>
            </Box>
          )}

          <div ref={messageEndRef} />
          {showMentions && mentionMatches.length > 0 && (
            <Box
              position="absolute"
              bg={colorMode === "light" ? "white" : "#1B202D"}
              color={colorMode === "light" ? "black" : "white"}
              border="1px solid #ccc"
              borderRadius="md"
              zIndex={1000}
              top={"75%"}
              maxH="150px"
              overflowY="auto"
              mt={2}
              w={{ base: "80%", md: "30%" }}
              p={2}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {mentionMatches.map((user) => (
                <Box
                  key={user._id}
                  p={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => {
                    const words = content.split(" ");
                    words[words.length - 1] = `@${user.name}`;
                    setContent(words.join(" ") + " ");
                    setShowMentions(false);
                    setMentionQuery("");
                  }}
                >
                  <HStack>
                    <Avatar
                      name={user.name}
                      size={{ base: "sm", md: "sm" }}
                      src={user.photo}
                    />
                    <Text>
                      {" "}
                      {user.name} ({user.role})
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      <HStack w={{ base: "100%", md: "90%" }} pb={"10%"} p={{base:1,md:"-15%"}} >
        <CustomInputs
          type={"text"}
          placeholder={"Type a message..."}
          value={content}
          fontSize={"md"}
          onChange={(e) => {
            const value = e.target.value;
            setContent(value);
            const words = value.slice(0, e.target.selectionStart).split(" ");
            const lastWord = words[words.length - 1];
            if (lastWord.startsWith("@")) {
              setMentionQuery(lastWord.slice(1));
              setShowMentions(true);
            } else {
              setMentionQuery("");
              setShowMentions(false);
            }
          }}
        />

        <CustomButton
          onClick={handleSend}
          disabled={isSending}
          leftIcon={<FaPaperPlane />}
          size={"md"}
          bgColor={"blue.400"}
          title={isSending ? "Sending..." : "Send"}
        />
      </HStack>
    </Box>
  );
};

export default Conversation;
