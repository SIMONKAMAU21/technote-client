import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetMessagesInThreadQuery,
  useSendMessageMutation,
} from "./inboxSlice";
import { Text } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";

const Conversation = () => {
    let  conversationId  = useParams();
    conversationId = conversationId?.id;

  const getReceiverIdFromConversation = (conversationId, loggedInUserId) => {
    const ids = conversationId?.split("_");
    return ids?.find((id) => id !== loggedInUserId);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const receiverId = getReceiverIdFromConversation(conversationId, user.id);

  const [content, setContent] = useState("");
  const {
    data: messages = [],
    isLoading,
    error,
  } = useGetMessagesInThreadQuery(conversationId);
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      await sendMessage({ content, receiverId }).unwrap();
      setContent("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Conversation</h2>

      {isLoading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>Error loading messages</p>
      ) : (
        <div style={{ marginBottom: 20 }}>
          {messages?.map((msg) => (
            <div key={msg._id} style={{ margin: "10px 0" }}>
              <Text>{formatDate(msg.timestamp)}</Text>{" "}
              <strong>{msg?.senderId?.name}</strong>: {msg?.content}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
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
      </div>
    </div>
  );
};

export default Conversation;
