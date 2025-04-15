import { Button } from "@chakra-ui/react";
import React from "react";

const CustomButton = ({
  title,
  onClick,
  bgColor,
  leftIcon,
  rightIcon,
  width,
  size,
  top,
  right,
  bottom

}) => {
  return (
    <Button
      leftIcon={leftIcon}
      size={size ? size : "sm"}
      w={width}
      top={top}
      right={right}
      bottom={bottom}
      rightIcon={rightIcon}
      color={"white"}
      bgColor={bgColor}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
