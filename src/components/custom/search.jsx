import {
    Input,
    InputGroup,
    InputLeftElement,
    useColorMode,
  } from "@chakra-ui/react";
  import React from "react";
  import { FaSearch } from "react-icons/fa";
  
  const SearchInput = ({ value, onChange, placeholder,width }) => {
    const { colorMode } = useColorMode();
  
    return (
      <InputGroup h={"50%"}  w={width ||{base:"80%",md:"40%"}} borderRadius={"full"} bg={colorMode === "light" ? "gray.200" : " none"}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color={colorMode === "dark" ? "gray" : "black"} />
        </InputLeftElement>
        <Input
        // h={{base:"10%",md:"auto"}}
          color={colorMode === "light" ? "black" : "white"}
          value={value}
          borderRadius={"full"}
          type="search"
          // border={"1px solid rgb(66,153,225)"}
          onChange={onChange}
          placeholder={placeholder}
        />
      </InputGroup>
    );
  };
  
  export default SearchInput;