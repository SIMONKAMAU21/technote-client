import React, { useState } from "react";
import {
  useGetAllMessagesQuery,
  useGetMessagesBySenderIdQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import {
  formatDate,
  formatSingleDate,
  formatTime,
} from "../../components/custom/dateFormat";
import { useNavigate } from "react-router-dom";
import Conversation from "./chartTread";
import CustomButton from "../../components/custom/button";
import { FaPlus } from "react-icons/fa6";

const Message = () => {
  const [content, setContent] = useState("");
  const receiverId = "67d97bf61cbcd3e2d166d712"; // Replace this dynamically (e.g., from props or URL)
  const senderId = "676db34a697242deb7308da9"; // Replace this dynamically (e.g., from props or URL)
  const {
    data: messages = [],
    isLoading,
    error,
  } = useGetMessagesBySenderIdQuery(receiverId);
  const { data: message = [], isLoading: loading } =
    useGetAllMessagesQuery(senderId);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const navigate = useNavigate();
  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      await sendMessage({ content, receiverId }).unwrap();
      setContent("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const gotoTrhead = (id) => {
    navigate(`/inbox/${id}`);
  };
  return (
    <Box style={{ padding: 20 }}>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <Box>
          {messages?.map((msg) => (
            <Box
              border={"1px solid #ccc"}
              borderRadius={"5px"}
              padding={"10px"}
              key={msg._id}
              _hover={{ cursor: "pointer",border: "1px solid green", bgColor: "#f0f0f0" }}
              onClick={() => {
                const senderId = msg.lastMessage.senderId._id;
                const receiverId = msg.lastMessage.receiverId._id;
                const sortedIds = [senderId, receiverId].sort();
                const conversationId = sortedIds.join("_");
                gotoTrhead(conversationId);
              }}
              style={{ margin: "10px 0" }}
            >
              <HStack fontSize={"sm"} justifyContent={"space-between"}>
                <Text>{formatSingleDate(msg.lastMessage.timestamp)}</Text>
                <Text fontSize={"sm"}>
                  {formatTime(msg.lastMessage.timestamp)}
                </Text>
              </HStack>
            <HStack>
            <Box
                w="20px"
                h="20px"
                borderRadius="full"
                bg="gray.200"
                overflow="hidden"
              >
                <Image
                  src={msg?.lastMessage?.senderId.photo}
                  alt={msg.name}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
              <strong>{msg?.lastMessage?.senderId?.name}</strong>:{" "}

            </HStack>
            {msg?.lastMessage?.content}

            </Box>
          ))}
        </Box>
      )}

      <Box style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </Box>
      <CustomButton onClick={()=>{}} bgColor={"blue.400"}leftIcon={<FaPlus/>} title={"Add Conversation"}/>
      {/* <Conversation/> */}
    </Box>
  );
};

export default Message;
