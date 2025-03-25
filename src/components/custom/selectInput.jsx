import { Select, Text, useColorMode, VStack } from "@chakra-ui/react";
import React from "react";

const SelectInput = ({
  value,
  placeholder,
  options,
  onChange,
  label,
  name,
  height,
  key,
}) => {
  const { colorMode } = useColorMode();
  return (
    <VStack alignItems={"flex-start"} w={"100%"} spacing={2}>
      <Text fontSize="sm" color={colorMode === "dark" ? "#E2E8F0" : "black"}>
        {label}
      </Text>
      <Select
      colorScheme={colorMode === "dark" ? "gray" : "blue"}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        h={height}
      >
        {options &&
          options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </Select>
    </VStack>
  );
};

export default SelectInput;
