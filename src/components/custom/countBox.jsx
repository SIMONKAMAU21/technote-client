import { Box, Heading, HStack, Icon, Text, useColorMode, VStack } from "@chakra-ui/react";
import { backIn } from "framer-motion";
import React from "react";

const CountBox = ({ icon, count, title, gradient, clickMe, color }) => {
  const{colorMode}=useColorMode()
  return (
    <Box
      bgGradient={{base:"none",md:gradient}}
      p={{ base: "2", md: "4" }}
      borderRadius="md"
      color={{base:colorMode==="dark"?"white":"black"}}
      backgroundColor={colorMode==="dark"?"none":"gray.100"}
      border={{base:"1px solid gray",md:"none"}}
      h={"100%"}
      boxShadow="dark-lg"
      w={{ base: "90%", md: "50%" }}
      onClick={clickMe}

    transition="box-shadow 0.3s ease" // Smooth hover effect
    // _disabled={disable}
    >
      <VStack align="start">
        <HStack>
          <Icon
            as={icon}
            boxSize={{ base: 6, md: 8 }}
            color={color}
          />
          <Text fontWeight={"bold"} fontSize={{base:"10px",md:"18px"}}>{count}</Text>
        </HStack>
        <Text
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