import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Avatar,
  Center,
  Divider,
  FormErrorMessage,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import CustomInputs from "../../components/custom/input";
import { useGetUsePprofileQuery, useUpdatePasswordMutation } from "./profileSlice";
import { ErrorToast, SuccessToast } from "../../components/toaster";

const Profile = () => {


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
const {data,isLoading:isFetching} =useGetUsePprofileQuery()



  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when typing
  };

  const handleUpdateProfile = () => {
    alert("Profile updated successfully!"); // Replace with actual update logic
  };

  const handleUpdatePassword = async () => {
    let newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!passwords.oldPassword) {
      newErrors.oldPassword = "Current password is required.";
    }

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

    if (Object.values(newErrors).some((error) => error)) return; // Stop execution if errors exist

    try {
      const payload = {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      };
      const response = await updatePassword(payload).unwrap();
      SuccessToast(response.message);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset fields
    } catch (error) {
    const errorMessae= error?.data?.message
    ErrorToast(errorMessae)
    }
  };

  return (
    <Center color={"black"} py={10}>
      <VStack
        spacing={5}
        w={{ base: "90%", md: "50%" }}
        p={5}
        borderRadius="lg"
        boxShadow="md"
      >
        <Heading size="lg">Profile</Heading>
        <Avatar size="xl" name={data?.name} src={data?.photo} />
        {/* <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone</FormLabel>
          <Input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input
            name="address"
            value={user.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </FormControl> */}
        <Button colorScheme="blue" onClick={handleUpdateProfile}>
          Save Changes
        </Button>
        <Divider />
        <Text >Change Password</Text>

        <FormControl isInvalid={errors.oldPassword}>
          <CustomInputs
            placeholder="Current password"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            type="password"
            name="oldPassword"
          />
          {errors.oldPassword && (
            <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={errors.newPassword}>
          <CustomInputs
            placeholder="New password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            type="password"
            name="newPassword"
          />
          {errors.newPassword && (
            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={errors.confirmPassword}>
          <CustomInputs
            placeholder="Confirm password"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            type="password"
            name="confirmPassword"
          />
          {errors.confirmPassword && (
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          colorScheme="green"
          onClick={handleUpdatePassword}
          isLoading={isLoading}
        >
          Update Password
        </Button>
      </VStack>
    </Center>
  );
};

export default Profile;
