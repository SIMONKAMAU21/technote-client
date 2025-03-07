import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react";
import { useAddStudentMutation, useUpdateStudentMutation } from "../pages/student/studentSlice";
import { ErrorToast, LoadingToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import { useGetAllUsersQuery } from "../pages/login/loginSlice";
import { useGetAllclassesQuery } from "../pages/classes/classSlice";

const StudentAdd = ({ isOpen, onClose, mode, studentData }) => {
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
  const [ updateStudent ] = useUpdateStudentMutation()


  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isEditing = !!studentData

  useEffect(() => {
    if (studentData && isEditing) {
      setFormData({
        userId: studentData.userId?.name || "",
        classId: studentData.classId?.name || "",
        parentId: studentData.parentId?._id || "",
        dob: studentData.dob
          ? formatDateToYYYYMMDD(studentData.dob) // Safely format the date
          : "",
        address: studentData.address || "",
        enrollmentDate: studentData.enrollmentDate
          ? formatDateToYYYYMMDD(studentData.enrollmentDate) // Safely format the date
          : "",
      });
    } else if ( !isEditing) {
      setFormData({
        userId: "",
        classId: "",
        parentId: "",
        dob: "",
        address: "",
        enrollmentDate: "",
      });
    }
  }, [studentData, mode]);
  
  // Utility function to safely format a date
  const formatDateToYYYYMMDD = (date) => {
    try {
      return new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    } catch {
      return ""; // Return an empty string if the date is invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoadingToast(true)
    try {
      if (!isEditing) {
        const response = await addStudent(formData).unwrap();
        console.log('response', response)
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
        onClose()
      } else if (isEditing) {
        const id = studentData._id
        const response = await updateStudent({ id, ...formData })
        SuccessToast(response.data.message)
        onClose()
      }

    } catch (error) {
      console.log(error)
      const errorMessage = error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
      LoadingToast(false)
      setFormData({
        userId: "",
        classId: "",
        parentId: "",
        dob: "",
        address: "",
        enrollmentDate: "",
      });
    } finally {
      LoadingToast(false)
    }
  };
  const students = users?.filter(student => student.role === "student") || []
  const parents = users?.filter(parent => parent.role === "parent") || []
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent fontSize={{ base: "15px", md: "18px" }} w={{ base: "90%", md: "100%" }}>
        <ModalHeader>{!isEditing ? " Add Student" : "Edit Student"}</ModalHeader>
        <ModalBody >
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
               {!isEditing ?
             <>
             <HStack w={"full"}>
             <VStack flex={1}>
               <Text fontWeight={"bold"} alignSelf={"self-start"}>Student Name</Text>
               <Select
                 h="50px"
                 name="userId"
                 fontSize={"12px"}
                 value={formData.userId}
                 onChange={handleRoleChange}
                 textTransform="capitalize"
                 placeholder="Select Student Name"
               >
                 {students?.map((student) => (
                   <option key={student._id} value={student._id}>
                     {student.name}
                   </option>
                 ))}
               </Select>

             </VStack> 

             <VStack flex={1}>
              <Text fontWeight={"bold"} alignSelf={"self-start"}>Class  Name</Text>
              <Select
                h="50px"
                name="classId"
                fontSize={"12px"}

                value={formData.classId}
                onChange={handleRoleChange}
                textTransform="capitalize"
                placeholder="Select Class Name"
              >
                {classes?.map((grade) => (
                  <option key={grade._id} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </Select>

            </VStack>
             </HStack>
    
            <Text fontWeight={"bold"} alignSelf={"self-start"}>Parent Name</Text>
              <Select
                h="50px"
                name="parentId"
                fontSize={"12px"}
                value={formData.parentId}
                onChange={handleRoleChange}
                textTransform="capitalize"
                placeholder="Select Parent Name"
              >
                {parents?.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
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
            </>
              :  <>
               
               <HStack w={"full"}>
               <VStack flex={1}>
              <Text fontWeight={"bold"} alignSelf={"self-start"}>Parent Name</Text>
              <Select
                h="50px"
                name="parentId"
                fontSize={"12px"}

                value={formData.parentId}
                onChange={handleRoleChange}
                textTransform="capitalize"
                placeholder="Select Parent Name"
              >
                {parents?.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
                ))}
              </Select>
              </VStack>
              <VStack flex={1}>
              <Text fontWeight={"bold"} alignSelf={"self-start"}>Class  Name</Text>
              <Select
                h="50px"
                name="classId"
                fontSize={"12px"}

                value={formData.classId}
                onChange={handleRoleChange}
                textTransform="capitalize"
                placeholder="Select Class Name"
              >
                {classes?.map((grade) => (
                  <option key={grade._id} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </Select>

            </VStack>
          </HStack>
              

            
            <CustomInputs
                label="Enrollment Date"
                name="enrollmentDate"
                placeholder="Select Enrollment Date"
                fontSize={{ base: "15px", md: "18px" }}
                value={formData.enrollmentDate}
                onChange={handleChange}
                type="date"
              />
              </>}

               
              {/* </HStack> */}



            
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText={isEditing ? "Adding..." : " Updating...."}
                w="full"
              >
                {isEditing? "Add Student" : "Save"}
              </Button>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StudentAdd;
