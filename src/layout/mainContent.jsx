import React from 'react'
import Header from './header'
import { Route, Routes } from 'react-router-dom'
import { Box, HStack, useBreakpointValue } from '@chakra-ui/react'
import Dashbord from '../pages/Dashbord'
import Students from '../pages/student/students'
import Teachers from '../pages/teacher/teachers'
import Settings from '../pages/setting/settings'
import Classes from '../pages/classes/classes'

const Maincontent = () => {
  const marginLeft = useBreakpointValue({ base: "0", md: "15%" });

  return (
  <>
  
      <Header />
      <HStack align="start" spacing={0} mt="60px">
      <Box flex="2" p={4} ml={marginLeft} w="100%" overflow="hidden">
      <Routes>
        <Route path='/Dashboard' element={<Dashbord/>}/>
        <Route path='/students' element={<Students/>}/>
        <Route path='/teachers' element={<Teachers/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/classes' element={<Classes/>}/>
      </Routes>
      </Box>
      </HStack>
    
  </>
  )
}

export default Maincontent