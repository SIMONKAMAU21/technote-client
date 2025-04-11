import React, { useState } from "react";
import {
  useGetAllMessagesQuery,
  useGetMessagesBySenderIdQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import { Box, Text } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import { useNavigate } from "react-router-dom";

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
      <h2>Messages</h2>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <Box style={{ marginBottom: 20, border: "solid 2px" }}>
          {messages?.map((msg) => (
            <Box
              key={msg._id}
              onClick={() => {
                const senderId = msg.lastMessage.senderId._id;
                const receiverId = msg.lastMessage.receiverId._id;
                const sortedIds = [senderId, receiverId].sort();
                const conversationId = sortedIds.join("_");
                gotoTrhead(conversationId);
              }}
              style={{ margin: "10px 0" }}
            >
              <Text>{formatDate(msg.lastMessage.timestamp)}</Text>{" "}
              <Text>{msg._id}</Text>
              <strong>{msg?.lastMessage?.senderId?.name}</strong>:{" "}
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
    </Box>
  );
};

export default Message;
