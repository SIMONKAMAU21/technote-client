import React, { useState } from "react";
import { Box, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, useColorMode, VStack } from "@chakra-ui/react";
// import { useAddStudentMutation } from "../pages/student/studentSlice";
import { ErrorToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import { useAddUserMutation } from "../pages/login/loginSlice";

const UserAdd = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    gender: "",

  });

  const [addUser, { isLoading }] = useAddUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response = await addUser(formData).unwrap();
      SuccessToast(response.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        gender: "",

      });
      onClose()
    } catch (error) {
      ErrorToast(error.message)
    }
  };
  const handleGenderChange = (value) => {
    setFormData((prevForm) => ({
      ...prevForm,
      gender: value,
    }));
  };
  // "name": "peninah gatuma",
  //   "email": "students@gmail.com",
  //   "password": "demo123",
  //   "role": "student",
  //   "phone": "0787245156",
  //   "address": "Thika",
  //   "gender": "Male"
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: "90%", md: "100%" }}>
        <ModalHeader>Add user</ModalHeader>
        <ModalBody >
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
              <CustomInputs
                label="full name"
                name="name"
                placeholder="Enter Student ID"
                value={formData.name}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <CustomInputs
                label="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />
              <CustomInputs
                label="address"
                name="address"
                placeholder="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
              />
              <Select h={"50px"} value={formData.role} onChange={handleRoleChange} placeholder='Select role'>
                <option value='admin'>Admin</option>
                <option value='student'>Student </option>
                <option value='teacher'>Teacher </option>
                <option value='parent'>Parent </option>

              </Select>
              <CustomInputs
                label="phone"
                name="phone"
                placeholder="enter phone number"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
              />

              <Box
                mt={4}
                w={"100%"}
                // border={"1px solid gray"}
                borderRadius={"10px"}
                color={colorMode === "light" ? "black" : "gray.100"}
              >
                <Text mb={2}>Gender</Text>
                <RadioGroup
                  onChange={handleGenderChange}
                  value={formData.gender || ""}
                >
                  <Stack direction="row">
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="Other">Other</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Adding"
                w="full"
              >
                Add Student
              </Button>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserAdd;
