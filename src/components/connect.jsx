import { useEffect, useState } from "react";
import { socket } from "../pages/events/eventSlice";
import { Text } from "@chakra-ui/react";

const Online = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div>
      {isConnected ? (
        <Text fontWeight={"bold"} color={"green.400"}>🟢 Online</Text>
      ) : (
        <Text fontWeight={"bold"} color={"red.500"} >🔴 Offline</Text>
      )}
    </div>
  );
};

export default Online;
