import React, { useState } from "react";
import CustomTable from "../../components/custom/table";
import SearchInput from "../../components/custom/search";
import { Box, HStack, IconButton, Progress, Skeleton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import CustomButton from "../../components/custom/button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { ErrorToast, LoadingToast, SuccessToast } from "../../components/toaster";
import { useDeletesubjectMutation, useGetAllsubjectsQuery } from "./teacherSlice";
import Subjectadd from "../../components/subjectAdd";


const Teachers = () => {

  const [currentsubject, setCurrentsubject] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const { data, error, isLoading } = useGetAllsubjectsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteSubject] = useDeletesubjectMutation()

  // Define columns for the table
  const columns = [
    { header: "Teacher name ", accessor: "teacherId.name" },
    { header: "class name", accessor: "classId.name" },
    { header: "subject Name", accessor: "name" },
    { header: "date of creation", accessor: "createdAt" },
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
              aria-label="Delete subject"

            />
          </HStack>
        )
      }
    },
  ];


  const handleEdit = (subject) => {
    setCurrentsubject(subject)
    onOpen()
  };

  // Parse data for nested properties (e.g., "classId.name")
  const parseNestedData = (row, accessor) =>
    accessor?.split(".").reduce((obj, key) => obj?.[key], row);

  // Format data for the table
  const formattedData = data
    ? data.map((subject) =>
      columns.reduce((acc, col) => {
        let value = parseNestedData(subject, col.accessor)
        if (col.accessor === "createdAt") {
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
  const handleDelete = async (subjectId) => {
    LoadingToast(true)
    try {
      const response = await deleteSubject(subjectId).unwrap()
      SuccessToast(response.message)
      LoadingToast(false)
    } catch (error) {
      ErrorToast("failed to delete a user")

    } finally {
      LoadingToast(false)
    }
  }

  const handleAdd = () => {
    setCurrentsubject("")
    onOpen()
  }
  return (
    <Box>
      <HStack>
        <SearchInput value={searchTerm} placeholder={"search subject..."} onChange={handleSearch} />
        <CustomButton onClick={handleAdd} leftIcon={<FaUserPlus />} formMode="add" title={"Add subject"} bgColor={"blue.400"} />
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
      <Subjectadd isOpen={isOpen} onClose={onClose} subjectData={currentsubject} />
    </Box>
  );
};


export default Teachers