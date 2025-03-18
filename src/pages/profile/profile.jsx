import React, { useRef, useState } from "react";
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
  HStack,
} from "@chakra-ui/react";
import CustomInputs from "../../components/custom/input";
import {
  useGetUserProfileQuery,
  useUpdatePasswordMutation,
  useUploadImageMutation,
} from "./profileSlice";
import {
  ErrorToast,
  LoadingToast,
  SuccessToast,
} from "../../components/toaster";
import profile from "../../assets/profile.png";
import CustomButton from "../../components/custom/button";
import upload from "../../assets/upload.png";
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
  const [selectedFile, setSelectedFile] = useState(null); // State for file upload
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { data } = useGetUserProfileQuery();
  const fileRef = useRef(null);
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleUpdatePassword = async () => {
    let newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!passwords.oldPassword)
      newErrors.oldPassword = "Current password is required.";
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
      const payload = {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      };
      const response = await updatePassword(payload).unwrap();
      SuccessToast(response.message);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Something went wrong. Please try again.";
      ErrorToast(errorMessage);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      ErrorToast("Please select an image to upload.");
      return;
    }
    try {
      LoadingToast(true);
      const formData = new FormData();
      formData.append("photo", selectedFile);
      const response = await uploadImage(formData).unwrap();
      SuccessToast(response.message);
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Image upload failed. Try again.";
      ErrorToast(errorMessage);
    } finally {
      LoadingToast(false);
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
        <Avatar
          mt={-12}
          size={{ base: "lg", md: "xl" }}
          name={data?.name}
          src={selectedFile ? URL.createObjectURL(selectedFile) : data?.photo}
        />

        <Divider />

        {/* Password Change Section */}
        <Text fontSize="lg" fontWeight="bold">
          Change Password
        </Text>

        <Box w="100%">
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
          isDisabled={
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
          }
          w="full"
        >
          Update Password
        </Button>

        {/* Profile Picture Upload */}
        <Text fontSize="lg" fontWeight="bold">
          Update Profile Picture
        </Text>
        <Box alignContent={"center"} display={"flex"} justifyContent={"center"} w="100%">
        <HStack w={{base:"100%",md:"50%"}} bg={colorMode === "dark" ? "gray.800" : "gray.200"}   p={{base:"1",md:"2"}} borderRadius={"md"}>
        <Image
            cursor={"pointer"}
            onClick={() => fileRef.current.click()}
            src={upload}
            width={"30px"}
            marginTop={"2px"}
            backgroundColor={"lightskyblue"}
            borderRadius={"md"}
          />
          {selectedFile ? <Text>{selectedFile?.name.length>20 ?` ${selectedFile?.name.slice(0,20)}....`: selectedFile?.name}</Text> : <Text color={"gray.500"}>Upload a new profile picture</Text>}
        </HStack>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
        <CustomButton
          bgColor={"green"}
          title={"Upload Picture"}
          w="full"
          onClick={handleUploadImage}
          isLoading={isUploading}
        />
      </VStack>
    </Flex>
  );
};

export default Profile;
