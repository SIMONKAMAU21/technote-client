import { Radio, RadioGroup, Stack, Text, useColorMode, VStack } from "@chakra-ui/react";
import React from "react";

const RadioInput = ({ onChange, value, options, label }) => {
    const { colorMode } = useColorMode();
  return (
    <VStack alignItems={"flex-start"} w={"100%"} spacing={2}>
      <Text fontSize="sm" color={colorMode === "dark" ? "#E2E8F0" : "black"}>
        {label}
      </Text>
      <RadioGroup onChange={onChange} value={value || ""}>
        <Stack direction="row">
          {options &&
            options.map((option, index) => (
              <Radio key={index} value={option.value}>{option.label}</Radio>
            ))}
        </Stack>
      </RadioGroup>
    </VStack>
  );
};

export default RadioInput;
