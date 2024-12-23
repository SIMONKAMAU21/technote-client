import React, { useState } from "react";
import { useGetAllStudentsQuery } from "./studentSlice";
import CustomTable from "../../components/custom/table";
import SearchInput from "../../components/custom/search";
import { Box, HStack, useDisclosure } from "@chakra-ui/react";
import { formatDate } from "../../components/custom/dateFormat";
import CustomButton from "../../components/custom/button";
import { FaUserPlus } from "react-icons/fa";
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
  ];

  // Parse data for nested properties (e.g., "classId.name")
  const parseNestedData = (row, accessor) =>
    accessor.split(".").reduce((obj, key) => obj?.[key], row);

  // Format data for the table
  const formattedData = data
    ? data.map((student) =>
        columns.reduce((acc, col) => {
          let value = parseNestedData(student,col.accessor)
          if(col.accessor === "dob"|| col.accessor === "enrollmentDate"){
            value = formatDate(value)
          }
          acc[col.accessor] = value
          return acc;
        }, {})
      )
    : [];

const filteredData =formattedData.filter((row)=> columns.some((col)=>{
  const cellValue = row[col.accessor]?.toString().toLowerCase()
  return cellValue?.includes(searchTerm)
}) )

const handleSearch =(e)=>{
  setSearchTerm(e.target.value.toLowerCase());
}
  return (
    <Box>
     <HStack>
     <SearchInput value={searchTerm} placeholder={"search student..."} onChange={handleSearch}/>
     <CustomButton onClick={onOpen} leftIcon={<FaUserPlus/>} title={"Add Student"} bgColor={"blue.400"}/>
     </HStack>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <CustomTable
          columns={columns}
          data={filteredData}
          onRowClick={(row) => alert(`Student ID: ${row["_id"]}`)}
        />
      )}
      <StudentAdd isOpen={isOpen} onClose={onClose}/>
    </Box>
  );
};

export default Students;
