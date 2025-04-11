import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMessagesInThreadQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import { Box, HStack, Text, useColorMode } from "@chakra-ui/react";
import { formatDate, formatTime } from "../../components/custom/dateFormat";
import CustomInputs from "../../components/custom/input";
import CustomButton from "../../components/custom/button";
import { FaMessage, FaPaperPlane } from "react-icons/fa6";
import { use } from "react";
import { ErrorToast, SuccessToast } from "../../components/toaster";

const Conversation = () => {
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
  //scrolling to latest message
  const messageEndRef = useRef();
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const colorMode = useColorMode();

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const response = await sendMessage({ content, receiverId }).unwrap();
      SuccessToast(response.message);
      setContent("");
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to send message";
      ErrorToast(errorMessage);
      console.error("Send error:", err);
    }
  };

  return (
    <Box
      h={"90%"}
      color={colorMode === "dark" ? "white" : "black"}
      w={{ base: "100%", md: "80%" }}
      position={"fixed"}
    >
      <Text color={colorMode === "dark" ? "blackAlpha.100" : "blackAlpha.600"}>
        {receiverId}
      </Text>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <Box overflow={"auto"} h={"92%"}>
          {messages?.map((msg) => (
            <Box
              key={msg._id}
              padding={"10px"}
              style={{
                margin: "10px 0",
                display: "flex",
                justifyContent:
                  msg.senderId._id === user.id ? "flex-end" : "flex-start",
                textAlign: msg.senderId._id === user.id ? "right" : "left",
              }}
            >
              <Box
                bgColor={msg.senderId._id === user.id ? "#DCF8C6" : "#F1F0F0"}
                p={2}
                borderRadius={10}
                boxShadow={
                  msg.senderId._id === user.id
                    ? "0 0 5px green"
                    : "0 0 5px gray"
                }
                style={{
                  wordWrap: "break-word",
                }}
              >
                <HStack>
                  <Text fontSize={"xs"}>{formatTime(msg.timestamp)}</Text>{" "}
                </HStack>
                {msg?.content}
              </Box>
            </Box>
          ))}
          <div ref={messageEndRef} />
        </Box>
      )}

      <HStack p={2} mb={-10}>
        <CustomInputs
          type={"text"}
          placeholder={"Type a message..."}
          value={content}
          fontSize={"md"}
          onChange={(e) => setContent(e.target.value)}
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
