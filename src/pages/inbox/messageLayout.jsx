import { Box } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const MessagesLayout = () => {
  return (
    <Box>
      {/* You can add a sidebar or tabs here */}
      <h2>Messages</h2>
      <Outlet />
    </Box>
  );
};

export default MessagesLayout;
