import { Box, HStack } from '@chakra-ui/react'
import React from 'react'

const messageWrapper = ({rightChildren,leftChuldren}) => {
  return (
<HStack>
<Box>{leftChuldren}</Box>
<Box>{rightChildren}</Box>
</HStack>  )
}

export default messageWrapper