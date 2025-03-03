import React, { useState } from "react";
import { useDeleteStudentMutation, useGetAllStudentsQuery } from "./studentSlice";
import CustomTable from "../../components/custom/table";
import SearchInput from "../../components/custom/search";
import { Box, HStack, IconButton, Progress, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import CustomButton from "../../components/custom/button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import StudentAdd from "../../components/studentAdd";
import { ErrorToast, LoadingToast, SuccessToast } from "../../components/toaster";

const Students = () => {

  const [currentStudent, setCurrentStudent] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const { data, error, isLoading } = useGetAllStudentsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteStudent] = useDeleteStudentMutation()

  // Define columns for the table
  const columns = [
    { header: "Student name", accessor: "userId.name" },
    { header: "Student ID", accessor: "studentId" },
    { header: "Class Name", accessor: "classId.name" },
    { header: "Parent Name", accessor: "parentId.name" },
    { header: "Date of Birth", accessor: "dob" },
    { header: "Enrollment Date", accessor: "enrollmentDate" },
    {
      header: "Actions",
      accessor: "_id",

      Cell: ({ row }) => {
        return (
          <HStack spacing={2}>
            <IconButton
              icon={<FaEdit />}
              size="sm"
              colorScheme="blue"
              onClick={() => handleEdit(row)}
            />
            <IconButton
              icon={<FaTrash />}
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(row._id)}
              aria-label="Delete user"

            />
          </HStack>
        )
      }
    },
  ];


  const handleEdit = (student) => {
    setCurrentStudent(student)
    setFormMode("edit")
    onOpen()
  };

  // Parse data for nested properties (e.g., "classId.name")
  const parseNestedData = (row, accessor) =>
    accessor?.split(".").reduce((obj, key) => obj?.[key], row);

  // Format data for the table
  const formattedData = data
    ? data.map((student) =>
      columns.reduce((acc, col) => {
        let value = parseNestedData(student, col.accessor)
        if (col.accessor === "dob" || col.accessor === "enrollmentDate") {
          value = formatDate(value)
        }
        acc[col.accessor] = value
        return acc;
      }, {})
    )
    : [];

  const filteredData = formattedData?.filter((row) => columns.some((col) => {
    const cellValue = row[col.accessor]?.toString().toLowerCase()
    return cellValue?.includes(searchTerm)
  }))

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }
  const handleDelete = async (userId) => {
    LoadingToast(true)
    try {
      const response = await deleteStudent(userId).unwrap()
      console.log('response', response)
      SuccessToast(response.message)
      LoadingToast(false)
    } catch (error) {
      ErrorToast("failed to delete a user")

    } finally {
      LoadingToast(false)
    }
  }

  const handleAdd = () => {
    setCurrentStudent("")
    setFormMode("add")
    onOpen()
  }
  return (
    <Box>
      <HStack>
        <SearchInput value={searchTerm} placeholder={"search student..."} onChange={handleSearch} />
        <CustomButton onClick={handleAdd} leftIcon={<FaUserPlus />} formMode="add" title={"Add Student"} bgColor={"blue.400"} />
      </HStack>
      {isLoading ? (
        <>
          <Progress size='xs' isIndeterminate />
          <Stack mt={{ base: "2%", md: "2%" }}>
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />

          </Stack></>
      ) : error ? (
        <Text mt={{ base: "2%" }} fontWeight={"bold"} alignSelf={"center"} color={"red.500"}> {"Oops something went wrong check your internet connection and try again .... "}</Text>
      ) : (
        <Box mt={2}>
          <CustomTable
            columns={columns}
            data={filteredData}
          />
        </Box>
      )}
      <StudentAdd isOpen={isOpen} onClose={onClose} mode={formMode} studentData={currentStudent} />
    </Box>
  );
};

export default Students;
