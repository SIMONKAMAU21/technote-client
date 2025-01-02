import { Box, Heading, HStack, Icon, Text, useColorMode, VStack } from "@chakra-ui/react";
import { backIn } from "framer-motion";
import React from "react";

const CountBox = ({ icon, count, title, gradient, clickMe, color }) => {
  const { colorMode } = useColorMode()
  return (
    <Box
      bgGradient={gradient}
      p={{ base: "2", md: "4" }}
      borderRadius="md"
      color={colorMode === "dark" ? "white" : "black"}
      borderBottom={{ base: "2px solid" }}
      borderBottomColor={color}
      h={"100%"}
      boxShadow="dark-lg"
      w={{ base: "90%", md: "50%" }}
      onClick={clickMe}
      transition="box-shadow 0.3s ease" // Smooth hover effect
    >
      <VStack align="start">
        <HStack>
          <Icon
            as={icon}
            boxSize={{ base: 6, md: 8 }}
            color={color}
          />
          <Text color={
            "whiteAlpha.800"
          } fontWeight={"bold"} fontSize={{ base: "10px", md: "18px" }}>{count}</Text>
        </HStack>
        <Text
          color={
            "whiteAlpha.800"
          }
          fontWeight={{ base: "bold", md: "bold" }}
          fontSize={{ base: "10px", md: "lg" }}
        >
          {title}
        </Text>
      </VStack>
    </Box>
  );
};

export default CountBox;