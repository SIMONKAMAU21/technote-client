import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  VStack,
  Avatar,
  Image,
  Divider,
  Text,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import CustomInputs from "../../components/custom/input";
import {
  useGetUserProfileQuery,
  useUpdatePasswordMutation,
} from "./profileSlice";
import { ErrorToast, SuccessToast } from "../../components/toaster";
import profile from "../../assets/profile.png";

const Profile = () => {
  const { colorMode } = useColorMode();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const { data } = useGetUserProfileQuery();

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleUpdatePassword = async () => {
    let newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!passwords.oldPassword) newErrors.oldPassword = "Current password is required.";
    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters.";
    }
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    try {
      const payload = { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword };
      const response = await updatePassword(payload).unwrap();
      SuccessToast(response.message);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const errorMessage = error?.data?.message || "Something went wrong. Please try again.";
      ErrorToast(errorMessage);
    }
  };

  return (
    <Flex justify="center" py={10}>
      <VStack
        spacing={6}
        w={{ base: "90%", md: "50%" }}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        align="center"
      >
        {/* Profile Header */}
        <Box w="100%" borderRadius="lg" overflow="hidden" position={"relative"}>
          <Image w="100%" h="100px" src={profile} objectFit="cover" />
        </Box>

        {/* Profile Avatar */}
        <Avatar right={{base:"50%",md:"55%"}} position={"absolute"} bottom={"360px"} size={{base:"lg",md:"xl"}} name={data?.name} src={data?.photo} />

        <Divider />

        {/* Password Change Section */}
        <Text fontSize="lg" fontWeight="bold">
          Change Password
        </Text>

        <Box w="100%" >
          <FormControl isInvalid={!!errors.oldPassword}>
            <CustomInputs
              placeholder="Current password"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              type="password"
              name="oldPassword"
            />
            <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!errors.newPassword}>
            <CustomInputs
              placeholder="New password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              type="password"
              name="newPassword"
            />
            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!errors.confirmPassword}>
            <CustomInputs
              placeholder="Confirm password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              type="password"
              name="confirmPassword"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
        </Box>

        {/* Update Button */}
        <Button
          colorScheme="green"
          onClick={handleUpdatePassword}
          isLoading={isLoading}
          isDisabled={!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
          w="full"
        >
          Update Password
        </Button>
      </VStack>
    </Flex>
  );
};

export default Profile;
