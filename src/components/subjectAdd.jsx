import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import CustomInputs from "./custom/input";
import {
  useAddsubjectMutation,
  useUpdatesubjectMutation,
} from "../pages/teacher/teacherSlice";
import { useGetAllclassesQuery } from "../pages/classes/classSlice";
import { useGetAllUsersQuery } from "../pages/login/loginSlice";
import { ErrorToast, LoadingToast, SuccessToast } from "./toaster";
import SelectInput from "./custom/selectInput";

const Subjectadd = ({ isOpen, onClose, mode, subjectData }) => {
  const [addSubject, { isLoading }] = useAddsubjectMutation();
  const [updateSubject] = useUpdatesubjectMutation();

  const [formData, setFormData] = useState({
    teacherId: "",
    classId: "",
    name: "",
  });
  const { data: users } = useGetAllUsersQuery();
  const { data: classes } = useGetAllclassesQuery();
  const teachers = users?.filter((student) => student.role === "teacher") || [];

  const isEditing = !!subjectData;

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (subjectData && isEditing) {
      setFormData({
        teacherId: subjectData?.teacherId?._id || "",
        classId: subjectData?.classId?.name || "",
        name: subjectData?.name || "",
      });
    } else if (!isEditing) {
      setFormData({
        teacherId: "",
        classId: "",
        name: "",
      });
    }
  }, [subjectData, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoadingToast(true);
    try {
      if (!isEditing) {
        const response = await addSubject(formData).unwrap();
        SuccessToast(response.message);
        LoadingToast(false);
        setFormData({
          teacherId: "",
          classId: "",
          name: "",
        });
        onClose();
      } else if (isEditing) {
        const id = subjectData._id;
        const response = await updateSubject({ id, ...formData });
        SuccessToast(response.data.message);
        onClose();
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
      LoadingToast(false);
      setFormData({
        teacherId: "",
        classId: "",
        name: "",
      });
    } finally {
      LoadingToast(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        fontSize={{ base: "15px", md: "18px" }}
        w={{ base: "90%", md: "100%" }}
      >
        <ModalHeader>
          {!isEditing ? " Add Subject" : "Edit Subject"}
        </ModalHeader>
        <ModalBody>
          <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
            <VStack spacing={4}>
              {!isEditing ? (
                <>
                  <HStack w={"full"}>
                    <VStack flex={1}>
                      <Text fontWeight={"bold"} alignSelf={"self-start"}>
                        Class name
                      </Text>
                      <Select
                        h="50px"
                        name="classId"
                        value={formData.classId}
                        onChange={handleRoleChange}
                        textTransform="capitalize"
                        fontSize={"12px"}
                        placeholder=" select class"
                      >
                        {classes?.map((classes) => (
                          <option key={classes._id} value={classes._id}>
                            {classes.name}
                          </option>
                        ))}
                      </Select>
                    </VStack>

                    <VStack flex={1}>
                      <Text fontWeight={"bold"} alignSelf={"self-start"}>
                        Teacher name
                      </Text>
                      <Select
                        h="50px"
                        fontSize={"12px"}
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleRoleChange}
                        textTransform="capitalize"
                        placeholder="Select teacher name"
                      >
                        {teachers?.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </Select>
                    </VStack>
                  </HStack>

                  <CustomInputs
                    label="Subject name"
                    name="name"
                    placeholder="subject name"
                    value={formData.subject}
                    fontSize={{ base: "12px", md: "15px" }}
                    onChange={handleChange}
                    type="text"
                  />
                </>
              ) : (
                <>
                  <HStack w={"full"}>
                    <VStack flex={1}>
                      <Text fontWeight={"bold"} alignSelf={"self-start"}>
                        Class name
                      </Text>
                      <Select
                        h="50px"
                        name="classId"
                        value={formData.classId}
                        onChange={handleRoleChange}
                        textTransform="capitalize"
                        fontSize={"12px"}
                        placeholder=" select class name"
                      >
                        {classes?.map((classes) => (
                          <option key={classes._id} value={classes._id}>
                            {classes.name}
                          </option>
                        ))}
                      </Select>
                    </VStack>

                    <VStack flex={1}>
                      <Text fontWeight={"bold"} alignSelf={"self-start"}>
                        Teacher name
                      </Text>
                      <Select
                        h="50px"
                        fontSize={"12px"}
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleRoleChange}
                        textTransform="capitalize"
                        placeholder="Select teacher name"
                      >
                        {teachers?.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </Select>
                    </VStack>
                  </HStack>

                  <CustomInputs
                    label="Subject name"
                    name="name"
                    placeholder="subject name"
                    value={formData.name}
                    fontSize={{ base: "12px", md: "15px" }}
                    onChange={handleChange}
                    type="text"
                  />
                </>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                // loadingText={mode === "add" ? "Adding..." : " Updating...."}
                w="full"
              >
                {!isEditing ? "Add Subject" : "Save"}
              </Button>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Subjectadd;
