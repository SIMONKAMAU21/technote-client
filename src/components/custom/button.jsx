import { Button } from "@chakra-ui/react";
import React from "react";

const CustomButton = ({
  title,
  onClick,
  bgColor,
  leftIcon,
  rightIcon,
  width,
}) => {
  return (
    <Button
      leftIcon={leftIcon}
      size={"sm"}
      w={width}
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
