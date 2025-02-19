import React from 'react';
import { Input, InputGroup, InputLeftElement, FormControl, FormLabel, useColorMode } from '@chakra-ui/react';

const CustomInputs = ({min,max, isDisabled,label,textAlign,height, value, placeholder, fontSize, icon: IconComponent, width, name, onChange,accept, variant,type, ...rest }) => {
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
          min={min}
          max={max}
          variant={variant}
          textAlign={textAlign}
          bg={colorMode === "dark"?"none":"gray.200"}
          placeholder={placeholder}
          {...rest}
          h={height || "50px"}
          isDisabled={isDisabled}
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