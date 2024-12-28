import React, { useState } from "react";
import { Box, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react";
import { useAddStudentMutation } from "../pages/student/studentSlice";
import { ErrorToast, LoadingToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import { useGetAllUsersQuery } from "../pages/login/loginSlice";
import { useGetAllclassesQuery } from "../pages/classes/classSlice";

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
  const { data: users, isFetching, isError } = useGetAllUsersQuery()
  const { data: classes } = useGetAllclassesQuery()
  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoadingToast(true)
    try {
   const response = await addStudent(formData).unwrap();
      SuccessToast(response.message);
      LoadingToast(false)
      setFormData({
        userId: "",
        classId: "",
        parentId: "",
        dob: "",
        address: "",
        enrollmentDate: "",
      });
    } catch (error) {
      const errorMessage = error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
      LoadingToast(false)
    }finally{
      LoadingToast(false)
    }
  };
  const students = users?.filter(student => student.role === "student") || []
  const parents = users?.filter(parent => parent.role === "parent") || []

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent fontSize={{ base: "15px", md: "18px" }} w={{ base: "90%", md: "100%" }}>
        <ModalHeader>Add Student</ModalHeader>
        <ModalBody >
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
              <Text fontWeight={"bold"} alignSelf={"self-start"}>Student Name</Text>
              <Select
                h="50px"
                name="userId"
                value={formData.userId}
                onChange={handleRoleChange}
                textTransform={"capitalize"}
                placeholder="select Student name"
              >{students && students?.map((student) => (
                <option key={student._id} value={student._id}>{student.name}</option>

              ))}
              </Select>

              <Text fontWeight={"bold"} alignSelf={"self-start"}>Class  Name</Text>
              <Select
                h="50px"
                value={formData.classId}
                name="classId"
                textTransform={"capitalize"}
                onChange={handleRoleChange}
                placeholder="select Class name"
              >
                {classes && classes?.map((grade) => (
                  <option key={grade._id} value={grade._id}>{grade.name}</option>

                ))}
              </Select>

              <Text fontWeight={"bold"} alignSelf={"self-start"}>Parent Name</Text>
              <Select
                h="50px"
                textTransform={"capitalize"}
                value={formData.parentId}
                name="parentId"
                onChange={handleRoleChange}
                placeholder="select Parent Name"
              >
                {parents && parents?.map((parent) => (
                  <option key={parent._id} value={parent._id}>{parent.name}</option>

                ))}

              </Select>

              <CustomInputs
                label="Date of Birth"
                name="dob"
                placeholder="Select Date of Birth"
                value={formData.dob}
                fontSize={{ base: "15px", md: "18px" }}
                onChange={handleChange}
                type="date"
              />
              <CustomInputs
                label="Address"
                name="address"
                placeholder="Enter Address"
                fontSize={{ base: "15px", md: "18px" }}

                value={formData.address}
                onChange={handleChange}
                type="text"
              />
              <CustomInputs
                label="Enrollment Date"
                name="enrollmentDate"
                placeholder="Select Enrollment Date"
                fontSize={{ base: "15px", md: "18px" }}
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
