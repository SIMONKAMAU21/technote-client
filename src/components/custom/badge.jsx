import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Badge = ({ bgColor, title }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      mt={{ base: "5%", md: "2%" }}
      alignItems={"center"}
      h={{ md: "30px", base: "20px" }}
      w={{ base: "70px", md: "100px" }}
      borderRadius={"full"}
      bgColor={bgColor}
    >
      <Text
        fontSize={{ base: "10px", md: "18px" }}
        alignItems={"center"}
        alignSelf={"center"}
      >
        {title}
      </Text>
    </Box>
  );
};

export default Badge;
