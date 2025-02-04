import {
  Box,
  HStack,
  List,
  ListItem,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorMode,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SearchIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaCog } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const location = useLocation();
  const displayMode = useBreakpointValue({ base: 'none', md: 'block' });
  const sidebarWidth = useBreakpointValue({ base: '70%', md: '15%' });

  const navigationStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    marginTop: '60px',
    width: sidebarWidth,
    fontSize: "14px",
    padding: '10px',
    boxShadow: isDark ? '5px 5px 10px rgba(4,4,4,0.25)' : '5px 5px 10px rgba(0,0,0,0.25)',
    backgroundColor: isDark ? 'gray.800' : 'white',
    color: isDark ? 'white' : 'black',
    zIndex: 500,
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const linkStyles = {
    display: 'block',
    padding: '10px',
    borderRadius: '0px 20px 20px 0px',
    margin: '5px 0 10px ',
    textDecoration: 'none',
    color: isDark ? 'white' : 'black',
  };

  const activeLinkStyles = {
    backgroundColor: isDark ? '#A0AEC0' : '#ccc',
    fontWeight: 'bold',
    color: isDark ? 'black' : 'black',
  };

  const navItems = [
    { to: '/Dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/students', label: 'Students', icon: FaUserGraduate },
    { to: '/teachers', label: 'Teachers', icon: FaChalkboardTeacher },
    { to: '/classes', label: 'Classes', icon: FaBook },
    { to: '/settings', label: 'Settings', icon: FaCog },
  ];

  const filterItems = navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLinkClick = () => {
    if (displayMode === 'none') {
      setIsOpen(false);
    }
  };

  return (
    <>

      {/* <Box sx={{ ...navigationStyles, display: isOpen ? 'block' : displayMode }}> */}
        <VStack sx={{ ...navigationStyles, display: isOpen ? 'block' : displayMode }} justifyContent={"space-between"} >
          <Box>
            <List>
              {filterItems.length === 0 && (
                <Box display="flex" flexDirection='column' alignItems="center" h='80vh' justifyContent='center'>
                  <Box mb={2} textAlign="center">
                    NO RESULTS FOUND <SearchIcon boxSize={6} />
                  </Box>
                </Box>
              )}

              {filterItems.map((item) => (
                <ListItem key={item.to}>
                  <NavLink
                    to={item.to}
                    style={({ isActive }) => isActive ? { ...linkStyles, ...activeLinkStyles } : linkStyles}
                    onClick={handleLinkClick}
                  >
                    <HStack spacing={2}>
                      <Icon as={item.icon} />
                      <Box>{item.label}</Box>
                    </HStack>
                  </NavLink>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <InputGroup>
              <InputRightElement>
                <SearchIcon />
              </InputRightElement>
              <Input
                placeholder='Type here to search...'
                value={searchQuery}
                type='search'
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search navigation items'
              />
            </InputGroup>
          </Box>
        </VStack>
      {/* </Box> */}
    </>
  );
};

export default Sidebar;
