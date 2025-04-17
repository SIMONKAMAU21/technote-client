import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMessagesInThreadQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import { Box, HStack, Modal, Text, useColorMode } from "@chakra-ui/react";
import { formatDate, formatTime } from "../../components/custom/dateFormat";
import CustomInputs from "../../components/custom/input";
import CustomButton from "../../components/custom/button";
import { FaMessage, FaPaperPlane } from "react-icons/fa6";
import { use } from "react";
import { ErrorToast, SuccessToast } from "../../components/toaster";
import { useGetAllUsersQuery } from "../login/loginSlice";

const Conversation = () => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0); // optional, for better control

  //getting conversationId from url
  let conversationId = useParams();
  conversationId = conversationId?.id;

  const getReceiverIdFromConversation = (conversationId, loggedInUserId) => {
    const ids = conversationId?.split("_");
    return ids?.find((id) => id !== loggedInUserId);
  };
  //getting reciver id from conversationId
  const user = JSON.parse(localStorage.getItem("user"));
  const receiverId = getReceiverIdFromConversation(conversationId, user.id);

  const [content, setContent] = useState("");
  //fetching messages by conversationId
  const {
    data: messages = [],
    isLoading,
    error,
  } = useGetMessagesInThreadQuery(conversationId);
  const { data: users = [], isLoading: loadingUsers } = useGetAllUsersQuery();

  //scrolling to latest message
  const messageEndRef = useRef();
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const {colorMode} = useColorMode();

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
      w={{ base: "100%", md: "80%" }}
      position={"fixed"}
    >
      <Text color={colorMode === "dark" ? "black" : "blackAlpha.100"}>
        {receiverId}
      </Text>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <Box overflow={"auto"} h={"92%"}>
          {messages.length > 0 ? (
            messages?.map((msg) => (
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
                  <HStack>
                    <Text fontSize={"xs"}>{formatTime(msg?.timestamp)}</Text>{" "}
                  </HStack>
                  {msg?.content}
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
            bg={colorMode === "light" ?"white" :"#1B202D"}
            color={colorMode === "light" ?"black" :"white"}
            border="1px solid #ccc"
            borderRadius="md"
            zIndex={1000}
            top={"75%"}
            maxH="150px"
            overflowY="auto"
            mt={2}
            w={{base:"80%",md:"30%"}}
            p={2}
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
               <Text> @{user.name} ({user.role})
                </Text>
              </Box>
            ))}
          </Box>
        )}
        </Box>
      )}

      <HStack p={2} mb={-10}>
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
          //   style={{ flex: 1, padding: 8 }}
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
