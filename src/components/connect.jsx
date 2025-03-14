import { useEffect, useState } from "react";
import { socket } from "../pages/events/eventSlice";
import { Box, Text } from "@chakra-ui/react";

const Online = ({size}) => {
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
    <Box border={"1px solid gray"}  borderRadius={"md"}>
      {isConnected ? (
        <Text fontSize={size} fontWeight={"bold"} color={"green.400"}>🟢 Online</Text>
      ) : (
        <Text fontSize={size} fontWeight={"bold"} color={"red.500"} >🔴 Offline</Text>
      )}
    </Box>
  );
};

export default Online;
