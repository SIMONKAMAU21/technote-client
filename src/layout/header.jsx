import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  HStack,
  IconButton,
  useColorMode,
  useTheme,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Center,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useGetUserProfileMutation } from "../pages/profile/profileSlice";
import Online from "../components/connect";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const theme = useTheme();
  const [userProfile, { data }] = useGetUserProfileMutation();
  useEffect(() => {
    userProfile();
  }, []);

  const textStyles = {
    color: "white",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    letterSpacing: "2px",
    flex: "1",
    fontSize: {
      base: "10px",
      md: "18px",
    },
  };
  if (!user) {
    navigate("/");
  }
  const sStyles = {
    color: theme.colors.accent.light,
    fontWeight: "900",
    fontSize: {
      base: "20px",
      md: "34px",
    },
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  return (
    <>
      <Box
        bg={
          colorMode === "light"
            ? theme.colors.primary.light
            : theme.colors.primary.dark
        }
        p="10px"
        display="flex"
        justifyContent="space-between"
        position="fixed"
        top={0}
        boxShadow={{ base: "0px 4px 6px rgba(0, 0, 0, 0.5)", md: "none" }}
        width="100%"
        zIndex="1000"
      >
        <IconButton
          icon={
            isOpen ? (
              <HamburgerIcon boxSize="20px" />
            ) : (
              <HamburgerIcon boxSize="20px" />
            )
          }
          display={{ base: "block", md: "none" }}
          bg={isDark ? "transparent" : "none"}
          color={"white"}
          onClick={() => setIsOpen(!isOpen)}
        />

        <Box sx={textStyles}>
          <Text sx={sStyles}>S</Text>
          <Text fontSize={{ base: "9px", md: "12px" }}>chool</Text>
          <Text sx={sStyles}>M</Text>
          <Text fontSize={{ base: "9px", md: "12px" }}>anagement</Text>
          {Online}
        </Box>
        <HStack size={"sm"}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            w={{ base: "40px" }}
            h={{ base: "40px" }}
            bg={"none"}
            color={textStyles.color}
          />
          <IconButton
            icon={<FaBell />}
            bg={isDark ? "transparent" : "none"}
            color={"white"}
            onClick={() => setIsOpen(!isOpen)}
          />

          <Menu size={{ base: "sm" }}>
            <MenuButton as={Text}>
              <Box
                w="40px"
                h="40px"
                borderRadius="full"
                bg="gray.200"
                overflow="hidden"
              >
                {data?.photo ? (
                  <Avatar
                    src={data.photo}
                    name={data.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                ) : (
                  <Center w="full" h="full" bg="blue.100">
                    <Text fontWeight="bold" color="blue.700">
                      {data?.name?.charAt(0) || "?"}{" "}
                      {data?.name?.charAt(8) || "?"}
                    </Text>
                  </Center>
                )}
              </Box>
            </MenuButton>
            <MenuList size={{ base: "sm" }}>
              <MenuItem onClick={handleProfile} icon={<FaUser />}>
                Profile
              </MenuItem>
              <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>

          <VStack display={{ base: "none", md: "block" }}>
            <Menu>
              <MenuButton color={"white"} as={Text}>
                <Text
                  fontWeight={"bold"}
                  fontSize={{ base: "12px", md: "12px" }}
                >
                  {data?.email}
                </Text>
                <Text
                  fontSize={{ base: "12px", md: "12px" }}
                  textTransform={"capitalize"}
                  alignSelf={"flex-start"}
                >
                  {data?.role}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfile} icon={<FaUser />}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          </VStack>
        </HStack>
      </Box>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
