import React from 'react';
import { Input, InputGroup, InputLeftElement, FormControl, FormLabel, useColorMode } from '@chakra-ui/react';

const CustomInputs = ({min,max, isDisabled,label,textAlign,height, value, placeholder, fontSize, icon: IconComponent, width, name, onChange,accept, variant,type,bg,ref, display,...rest }) => {
  const { colorMode } = useColorMode();

  return (
    <FormControl  fontSize={{base:"10px"}} color={colorMode === "light" ? "black" : "gray.100"}>
      {label && <FormLabel fontWeight={"normal"} mt={"1%"} fontSize={fontSize}>{label}</FormLabel>}
      <InputGroup>
        {IconComponent && (
          <InputLeftElement pointerEvents="none">
            <IconComponent />
          </InputLeftElement>
        )}
        <Input
          type={type}
          value={value}
          fontSize={fontSize || {base:"12px",md:"15px"}}
          onChange={onChange}
          name={name}
          ref={ref}
          display={display || "block"}
          min={min}
          max={max}
          variant={variant}
          textAlign={textAlign}
          bg={colorMode === "dark"?"gray.800":"gray.200" || bg}
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