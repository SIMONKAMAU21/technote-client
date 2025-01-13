import React, { useState } from "react";
import CustomTable from "../../components/custom/table";
import SearchInput from "../../components/custom/search";
import { Box, HStack, IconButton, Skeleton, Spacer, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import CustomButton from "../../components/custom/button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { ErrorToast, LoadingToast, SuccessToast } from "../../components/toaster";
import { useDeleteClassMutation, useGetAllclassesQuery } from "./classSlice";
import ClassAdd from "../../components/classAdd";

const Classes = () => {

  const [currentClass, setCurrentClass] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const { data, error, isLoading } = useGetAllclassesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteclass] = useDeleteClassMutation()

  // Define columns for the table
  const columns = [
    { header: "class name", accessor: "name" },
    { header: "teacher Name", accessor: "teacherId.name" },
    { header: "created at", accessor: "createdAt" },
    { header: "updated at", accessor: "updatedAt" },

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

  const parseNestedData = (row, accessor) =>
    accessor?.split(".").reduce((obj, key) => obj?.[key], row);

  // Format data for the table
  const formattedData = data
    ? data.map((classes) =>
      columns.reduce((acc, col) => {
        let value = parseNestedData(classes, col.accessor)
        if (col.accessor === "updatedAt" || col.accessor === "createdAt") {
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
  const handleEdit = (grade) => {
    setCurrentClass(grade)
    setFormMode("edit")
    onOpen()
  };
  // for serching
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }

  // for deleting
  const handleDelete = async (classId) => {
    LoadingToast(true)
    try {
      const response = await deleteclass(classId).unwrap()
      SuccessToast(response.message)
      LoadingToast(false)
    } catch (error) {
      ErrorToast("failed to delete a user")

    } finally {
      LoadingToast(false)
    }
  }
  const handleAdd = () => {
    setCurrentClass("")
    setFormMode("add")
    onOpen()
  };
  return (
    <Box>
      <HStack>
        <SearchInput value={searchTerm} placeholder={"search class..."} onChange={handleSearch} />
        <CustomButton formMode="add" onClick={handleAdd} leftIcon={<FaUserPlus />} title={"Add class"} bgColor={"blue.400"} />
      </HStack>
      {isLoading ? (
        <Stack mt={{ base: "2%", md: "2%" }}>
          <Skeleton h={"20px"} />
          <Skeleton h={"20px"} />
          <Skeleton h={"20px"} />
          <Skeleton h={"20px"} />

        </Stack>
      ) : error ? (
        <Text mt={{ base: "2%" }} fontWeight={"bold"} alignSelf={"center"} color={"red.500"}> {"Oops something went wrong check your internet connection and try again .... "}</Text>
      ) : (
        <HStack mt={2}>
           <CustomTable
          columns={columns}
          data={filteredData}
        />
        
        </HStack>
       
      )}
      <ClassAdd isOpen={isOpen} classData={currentClass} onClose={onClose} mode={formMode}/>
    </Box>
  );
};



export default Classes