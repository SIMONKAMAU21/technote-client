import { Box, HStack, useColorMode } from "@chakra-ui/react";
import React from "react";

const AuthWrapper = ({ leftChildren, rightChildren, background }) => {

  return (
    <HStack
      // bg={background}
      h={"100%"}
      w={"100%"}
      spacing={"0"}
      align={"stretch"}
    >
      <Box
        m={"0px"}
        alignItems={"center"}
        justifyContent={"center"}
        w={{ base: "100%", md: "60%" }}
        h={"100%"}
        overflow={"scroll"}
        // bg={"#131619"}
        // bg={colorMode === 'light' ? theme.colors.primary.light : theme.colors.primary.dark}

        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {leftChildren}{" "}
      </Box>
      <Box
        w={{ base: "100%", md: "40%" }}
        h={"100%"}
        display={{ base: "none", md: "block" }}
        bg={background}
      >
        {rightChildren}{" "}
      </Box>
    </HStack>
  );
};

export default AuthWrapper;