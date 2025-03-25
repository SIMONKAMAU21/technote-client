import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Text, useColorMode, VStack } from "@chakra-ui/react";

const Phoneinput = ({ value, onChange }) => {
  const { colorMode } = useColorMode();

  return (
    <VStack alignItems={"flex-start"} w={"100%"} spacing={2}>
    <Text  fontSize="sm" color={colorMode === "dark" ? "#E2E8F0" : "black"}>Phone Number</Text>
       <PhoneInput
      country={"ke"}
      value={value}
      onChange={onChange}
      containerStyle={{
        width: "100%",
      }}
      inputStyle={{
        width: "100%",
        backgroundColor: colorMode === "dark" ? "#1A202C" : "#E9EEF6",
        color: colorMode === "dark" ? "#E2E8F0" : "black",
        borderColor: colorMode === "dark" ? "#4A5568" : "#CBD5E0",
        // padding: "12px",
        height: "50px",
        borderRadius: "8px",
      }}
      buttonStyle={{
        backgroundColor: colorMode === "dark" ? "#1A202C" : "#E2E8F0",
        borderColor: colorMode === "dark" ? "#4A5568" : "#CBD5E0",
      }}
      dropdownStyle={{
        backgroundColor: colorMode === "dark" ? "#1A202C" : "#E9EEF6",
        color: colorMode === "dark" ? "#E2E8F0" : "black",
      }}
    />
    </VStack>
 
  );
};

export default Phoneinput;
