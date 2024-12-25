import React, { useState } from "react";
import { Box, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react";
import { useAddStudentMutation } from "../pages/student/studentSlice";
import { ErrorToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";

const StudentAdd = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    classId: "",
    parentId: "",
    dob: "",
    address: "",
    enrollmentDate: "",
  });

  const [addStudent, { isLoading }] = useAddStudentMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(formData).unwrap();
      SuccessToast(response.message);
      setFormData({
        userId: "",
        classId: "",
        parentId: "",
        dob: "",
        address: "",
        enrollmentDate: "",
      });
    } catch (error) {
      ErrorToast(error.message)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: "90%", md: "100%" }}>
        <ModalHeader>Add Student</ModalHeader>
        <ModalBody >
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
              <CustomInputs
                label="Student ID"
                name="userId"
                placeholder="Enter Student ID"
                value={formData.userId}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Class ID"
                name="classId"
                placeholder="Enter Class ID"
                value={formData.classId}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Parent ID"
                name="parentId"
                placeholder="Enter Parent ID"
                value={formData.parentId}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Date of Birth"
                name="dob"
                placeholder="Select Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                type="date"
              />
              <CustomInputs
                label="Address"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Enrollment Date"
                name="enrollmentDate"
                placeholder="Select Enrollment Date"
                value={formData.enrollmentDate}
                onChange={handleChange}
                type="date"
              />
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

export default StudentAdd;
