import React, { useState } from "react";
import { useGetAllStudentsQuery } from "./studentSlice";
import CustomTable from "../../components/custom/table";
import SearchInput from "../../components/custom/search";
import { Box, HStack, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import CustomButton from "../../components/custom/button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import StudentAdd from "../../components/studentAdd";

const Students = () => {
  const { data, error, isLoading } = useGetAllStudentsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()


  // Define columns for the table
  const columns = [
    { header: "Student name", accessor: "userId.name" },
    { header: "Class Name", accessor: "classId.name" },
    { header: "Parent Name", accessor: "parentId.name" },
    { header: "Date of Birth", accessor: "dob" },
    { header: "Address", accessor: "address" },
    { header: "Enrollment Date", accessor: "enrollmentDate" },
    {
      header: "Actions",
      Cell: ({ row }) => {
        console.log('row', row)

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
  const handleDelete = () => {

  }
  return (
    <Box>
      <HStack>
        <SearchInput value={searchTerm} placeholder={"search student..."} onChange={handleSearch} />
        <CustomButton onClick={onOpen} leftIcon={<FaUserPlus />} title={"Add Student"} bgColor={"blue.400"} />
      </HStack>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <Text mt={{ base: "2%" }} fontWeight={"bold"} alignSelf={"center"} color={"red.500"}> {"Oops something went wrong check your internet connection and try again .... "}</Text>
      ) : (
        <CustomTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => alert(`Student ID: ${row["_id"]}`)}
        />
      )}
      <StudentAdd isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Students;
