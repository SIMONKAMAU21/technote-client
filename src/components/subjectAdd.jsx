import { Box, Button, HStack, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import CustomInputs from './custom/input'
import { useAddsubjectMutation } from '../pages/teacher/teacherSlice';

const Subjectadd = ({ isOpen, onClose, mode, subjectData }) => {
    const [addStudent, { isLoading }] = useAddsubjectMutation();
    const [formData, setFormData] = useState({
        userId: "",
        classId: "",
        parentId: "",
        dob: "",
        address: "",
        enrollmentDate: "",
    });

    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
    useEffect(() => {
        if (subjectData && mode === "edit") {
            setFormData({
                userId: subjectData.userId?.name || "",
                classId: subjectData.classId?.name || "",
                parentId: subjectData.parentId?._id || "",
                dob: subjectData.dob
                    ? formatDateToYYYYMMDD(subjectData.dob) // Safely format the date
                    : "",
                address: subjectData.address || "",
                enrollmentDate: subjectData.enrollmentDate
                    ? formatDateToYYYYMMDD(subjectData.enrollmentDate) // Safely format the date
                    : "",
            });
        } else if (mode === "add") {
            setFormData({
                userId: "",
                classId: "",
                parentId: "",
                dob: "",
                address: "",
                enrollmentDate: "",
            });
        }
    }, [subjectData, mode]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        LoadingToast(true)
        try {
            if (mode === "add") {
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
            } else if (mode === "edit") {
                const id = subjectData._id
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

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent fontSize={{ base: "15px", md: "18px" }} w={{ base: "90%", md: "100%" }}>
                <ModalHeader>{mode === "add" ? " Add Subject" : "Edit Subject"}</ModalHeader>
                <ModalBody >
                    <Box as="form" onSubmit={handleSubmit} w="full" p={4}>
                        <VStack spacing={4}>
                            {mode === "add" ?
                                <>
                                    <HStack>
                                        <VStack>
                                            <Text fontWeight={"bold"} alignSelf={"self-start"}>Student Name</Text>
                                            {/* <Select
                                                h="50px"
                                                name="userId"
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
                                            </Select> */}

                                        </VStack>

                                        <VStack>
                                            <Text fontWeight={"bold"} alignSelf={"self-start"}>Class  Name</Text>
                                            {/* <Select
                                                h="50px"
                                                name="classId"
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
                                            </Select> */}

                                        </VStack>
                                    </HStack>

                                    <Text fontWeight={"bold"} alignSelf={"self-start"}>Parent Name</Text>
                                    <Select
                                        h="50px"
                                        name="parentId"
                                        // value={formData.parentId}
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
                                        // value={formData.dob}
                                        fontSize={{ base: "15px", md: "18px" }}
                                        onChange={handleChange}
                                        type="date"
                                    />
                                    <CustomInputs
                                        label="Address"
                                        name="address"
                                        placeholder="Enter Address"
                                        fontSize={{ base: "15px", md: "18px" }}
                                        // value={formData.address}
                                        onChange={handleChange}
                                        type="text"
                                    />
                                    <CustomInputs
                                        label="Enrollment Date"
                                        name="enrollmentDate"
                                        placeholder="Select Enrollment Date"
                                        fontSize={{ base: "15px", md: "18px" }}
                                        // value={formData.enrollmentDate}
                                        onChange={handleChange}
                                        type="date"
                                    />
                                </>
                                : <>

                                    {/* <HStack>
                                        <VStack>
                                            <Text fontWeight={"bold"} alignSelf={"self-start"}>Parent Name</Text>
                                            <Select
                                                h="50px"
                                                name="parentId"
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
                                        <VStack>
                                            <Text fontWeight={"bold"} alignSelf={"self-start"}>Class  Name</Text>
                                            <Select
                                                h="50px"
                                                name="classId"
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
                                    </HStack> */}



                                    {/* <CustomInputs
                                        label="Enrollment Date"
                                        name="enrollmentDate"
                                        placeholder="Select Enrollment Date"
                                        fontSize={{ base: "15px", md: "18px" }}
                                        value={formData.enrollmentDate}
                                        onChange={handleChange}
                                        type="date"
                                    /> */}
                                </>}


                            {/* </HStack> */}

                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={isLoading}
                                loadingText={mode === "add" ? "Adding..." : " Updating...."}
                                w="full"
                            >
                                {mode === "add" ? "Add Subject" : "Save"}
                            </Button>
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default Subjectadd