import React from 'react';
import { Input, InputGroup, InputLeftElement, FormControl, FormLabel, useColorMode } from '@chakra-ui/react';

const CustomInputs = ({ label, value, placeholder, fontSize, icon: IconComponent, width, name, onChange,accept, variant,type, ...rest }) => {
  const { colorMode } = useColorMode();

  return (
    <FormControl fontSize={{base:"10px"}} color={colorMode === "light" ? "black" : "gray.100"}>
      {label && <FormLabel mt={"1%"} fontSize={fontSize}>{label}</FormLabel>}
      <InputGroup>
        {IconComponent && (
          <InputLeftElement pointerEvents="none">
            <IconComponent />
          </InputLeftElement>
        )}
        <Input
          type={type}
          value={value}
          fontSize={fontSize}
          onChange={onChange}
          name={name}
          variant={variant}
          bg={colorMode === "dark"?"none":"gray.200"}
          placeholder={placeholder}
          {...rest}
          h={"50px"}
          accept={accept}
          w={width}
          // variant={"outline"}
          isRequired
        />
      </InputGroup>
    </FormControl>


  );
};

export default CustomInputs;