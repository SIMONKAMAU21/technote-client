import React, { useEffect, useState } from "react";
import { Box, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react";
import { ErrorToast, LoadingToast, SuccessToast } from "./toaster";
import CustomInputs from "./custom/input";
import { useAddClassMutation, useUpdateClassMutation } from "../pages/classes/classSlice";
import { useGetAllUsersQuery } from "../pages/login/loginSlice";

const ClassAdd = ({ isOpen, onClose, classData, mode }) => {
    const [formData, setFormData] = useState({
        name: "",
        teacherId: "",

    });

    const [addClass, { isLoading }] = useAddClassMutation();
    const { data: users, isFetching, isError } = useGetAllUsersQuery()
    const [updateClass] = useUpdateClassMutation()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (classData && mode === "edit") {
            setFormData({
                name: classData.name || "",
                teacherId: classData.teacherId || "",
            });
        } else if (mode === "add") {
            setFormData({
                name: "",
                teacherId: "",
            });
        }
    }, [classData, mode]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        LoadingToast(true)
        try {
            if (mode === "add") {
                const response = await addClass(formData).unwrap();
                SuccessToast(response.message);
                LoadingToast(false)
                setFormData({
                    name: "",
                    teacherId: "",

                });
                onClose()
            } else if (mpde === "edit") {
                const id = classData._id
                const response = await updateClass({})
            }

        } catch (error) {
            const errorMessage = error?.data?.message || "An error occurred. Please try again.";
            ErrorToast(errorMessage);
            LoadingToast(false)
            setFormData({
                name: "",
                teacherId: ""
            })
        } finally {
            LoadingToast(false)
        }
    };
    const teacher = users?.filter(teacher => teacher.role === "teacher") || []
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent fontSize={{ base: "15px", md: "18px" }} w={{ base: "90%", md: "100%" }}>
                <ModalHeader>{mode === "add" ? "Add class" : " Edit class"}</ModalHeader>
                <ModalBody >
                    <Box onSubmit={handleSubmit} w="full" p={4}>
                        <VStack as={"form"} spacing={4}>
                            <Text fontWeight={"bold"} alignSelf={"self-start"}>Teacher Name</Text>
                            <Select
                                h="50px"
                                name="teacherId"
                                value={formData.teacherId}
                                onChange={handleChange}
                                textTransform={"capitalize"}
                                placeholder="select teacher  name"
                            >{teacher && teacher?.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>{teacher.name}</option>

                            ))}
                            </Select>

                            <CustomInputs
                                label="class name"
                                name="name"
                                value={formData.name}
                                placeholder={"Enter class name..."}
                                fontSize={{ base: "15px", md: "18px" }}
                                onChange={handleChange}
                                type="text"
                            />

                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={isLoading}
                                loadingText="Adding"
                                w="full"
                            >
                                {mode === "add" ? "Add Class " : "Edit Class"}
                            </Button>
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ClassAdd;
