import React, { useEffect, useState } from "react";
import { Box, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, useColorMode, VStack } from "@chakra-ui/react";
import { ErrorToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import { useAddUserMutation, useUpdateUserMutation } from "../pages/login/loginSlice";

const UserForm = ({ isOpen, onClose, userData, mode   }) => {
  const { colorMode } = useColorMode();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData && mode === "edit") {
      setFormData(userData);
    } else if(mode === "add"){
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        gender: "",
      });
    }
  }, [userData,mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleGenderChange = (value) => {
    setFormData((prevForm) => ({
      ...prevForm,
      gender: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        const response = await addUser(formData).unwrap();
        SuccessToast(response.message);
      } else if (mode === "edit") {
        const id = userData._id
        const response = await updateUser({ id: userData._id, ...formData }).unwrap();
        console.log('response', id)
        SuccessToast(response.message);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        gender: "",
      });
      onClose();
    } catch (error) {
      ErrorToast(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: "90%", md: "100%" }}>
        <ModalHeader>{mode === "add" ? "Add User" : "Edit User"}</ModalHeader>
        <ModalBody>
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
              <CustomInputs
                label="Full Name"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              {mode === "add" && (
                <CustomInputs
                  label="Password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                />
              )}
              <CustomInputs
                label="Address"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                type="text"
              />
              <Select
                h="50px"
                value={formData.role}
                onChange={handleRoleChange}
                placeholder="Select Role"
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </Select>
              <CustomInputs
                label="Phone"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
              />
              <Box mt={4} w="100%" borderRadius="10px" color={colorMode === "light" ? "black" : "gray.100"}>
                <Text mb={2}>Gender</Text>
                <RadioGroup onChange={handleGenderChange} value={formData.gender || ""}>
                  <Stack direction="row">
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="Other">Other</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              { mode === "add" &&    <Button
                type="submit"
                colorScheme="blue"
                isLoading={isAdding || isUpdating}
                loadingText={mode === "add" ? "Adding..." : "Updating..."}
                w="full"
              >
                Add User 
              </Button>}
              { mode === "edit" &&    <Button
                type="submit"
                colorScheme="blue"
                isLoading={ isUpdating}
                loadingText= "Updating..."
                w="full"
              >
              update user
              </Button>}
           
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
