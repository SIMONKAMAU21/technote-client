import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { ErrorToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../pages/login/loginSlice";
import Phoneinput from "./custom/phoneInput";
import SelectInput from "./custom/selectInput";
import RadioInput from "./custom/radioInput";

const UserForm = ({ isOpen, onClose, userData, mode }) => {
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
    } else if (mode === "add") {
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
  }, [userData, mode]);

  const handleChange = (e) => {
    if (typeof e === "string") {
      setFormData((prev) => ({ ...prev, phone: e }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        const id = userData._id;
        const response = await updateUser({
          id: userData._id,
          ...formData,
        }).unwrap();
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
          <Box as="form" onSubmit={handleSubmit} w="full" p={2}>
            <VStack spacing={4}>
              <HStack>
                <CustomInputs
                  label="Full Name"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  width={"100%"}
                />
                <CustomInputs
                  label="Email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
              </HStack>

              <CustomInputs
                label="Address"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                type="text"
              />
          
              <Phoneinput value={formData.phone} onChange={handleChange} />

          
              <RadioInput
              onChange={handleGenderChange}
              value={formData.gender || ""}
              label={"Gender"}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <SelectInput
                height={"50px"}
                value={formData.role}
                onChange={handleRoleChange}
                placeholder={"select role"}
                label={"Select Role"}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "student", label: "Student" },
                  { value: "teacher", label: "Teacher" },
                  { value: "parent", label: "Parent" },
                ]}
              />
              {mode === "add" && (
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isAdding || isUpdating}
                  loadingText={mode === "add" ? "Adding..." : "Updating..."}
                  w="full"
                >
                  Add User
                </Button>
              )}
              {mode === "edit" && (
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isUpdating}
                  loadingText="Updating..."
                  w="full"
                >
                  update user
                </Button>
              )}
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
