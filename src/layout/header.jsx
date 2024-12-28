import React, { useState } from 'react'
import { Text, Box, Button, Avatar, HStack, AvatarBadge, IconButton, useColorMode, useTheme, VStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark';
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const theme = useTheme()
  const textStyles = {
    color: "white",
    fontWeight: "600",
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '2px',
    flex: '1',
    fontSize: {
      base: '10px',
      md: '18px'
    },

  }

  const sStyles = {
    color: theme.colors.accent.light,
    fontWeight: '900',
    fontSize: {
      base: "20px",
      md: "34px"
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <Box
        bg={colorMode === 'light' ? theme.colors.primary.light : theme.colors.primary.dark}
        p='10px'
        display='flex'
        justifyContent='space-between'
        position='fixed'
        top={0}
        boxShadow={{ base: '0px 4px 6px rgba(0, 0, 0, 0.5)', md: 'none' }}
        width='100%'
        zIndex='1000'
      >
        <IconButton
          icon={isOpen ? <HamburgerIcon boxSize="20px" /> : <HamburgerIcon boxSize="20px" />}
          display={{ base: 'block', md: 'none' }}
          bg={isDark ? "transparent" : 'none'}
          color={'white'}
          onClick={() => setIsOpen(!isOpen)}
        />
        <Box sx={textStyles} onClick={handleLogout}>
          <Text sx={sStyles}>S</Text>
          <Text fontSize={{ base: "9px", md: "18px" }}>chool</Text>
          <Text sx={sStyles}>M</Text>
          <Text fontSize={{ base: "9px", md: "18px" }}>anagement</Text>
        </Box>
        <HStack>
          <Avatar size={{ base: "sm", md: "md" }} name={user.name} objectFit='cover' bg={theme.colors.accent.light}>
            <AvatarBadge bg='teal' boxSize={{ base: "10px", md: '1.2em' }} />
          </Avatar>

          <VStack display={{ base: "none", md: "block" }}  >

            <Menu>
              <MenuButton as={Text}>
                <Text fontSize={{ base: "12px", md: "18px" }}>{user.email}</Text>
                <Text textTransform={"capitalize"} alignSelf={"flex-start"}>{user.role}</Text>

              </MenuButton>
              <MenuList>
                <MenuItem>New File</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                <MenuItem>Open...</MenuItem>
                <MenuItem>Save File</MenuItem>
              </MenuList>
            </Menu>

          </VStack>
          <IconButton
            aria-label='Toggle color mode'
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            w={{ base: '40px' }}
            h={{ base: "40px" }}
            bg={"none"}
            color={textStyles.color}
          />
        </HStack>
      </Box>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}


export default Header