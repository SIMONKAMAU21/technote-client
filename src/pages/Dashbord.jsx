import React, { useState } from 'react'
import { useGetAllUsersQuery } from './login/loginSlice'
import { Box, HStack, SimpleGrid, Text, useDisclosure, VStack } from '@chakra-ui/react'
import SearchInput from '../components/custom/search'
import CustomButton from '../components/custom/button'
import CustomTable from '../components/custom/table'
import { FaBookReader, FaPen, FaPenAlt, FaPersonBooth, FaUserPlus } from 'react-icons/fa'
import { formatDate } from '../components/custom/dateFormat'
import CountBox from '../components/custom/countBox'
import Badge from '../components/custom/badge'

const Dashbord = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: users, isFetching, isLoading, isError } = useGetAllUsersQuery()
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }
  // Define columns for the table
  const columns = [
    { header: "name", accessor: "name" },
    { header: "email", accessor: "email" },
    { header: "role", accessor: "role" },
    { header: "phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "gender", accessor: "gender" },
  ];
  // Parse data for nested properties (e.g., "classId.name")
  const parseNestedData = (row, accessor) =>
    accessor.split(".").reduce((obj, key) => obj?.[key], row);

  // Format data for the table
  const formattedData = users
    ? users.map((student) =>
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

  const filteredData = formattedData.filter((row) => columns.some((col) => {
    const cellValue = row[col.accessor]?.toString().toLowerCase()
    return cellValue?.includes(searchTerm)
  }))

  const studentCount = users ? users.filter((user) => user.role === "student").length : 0
  const parentCount = users ? users.filter((user) => user.role === "parent").length : 0
  const teacherCount = users ? users.filter((user) => user.role === "teacher").length : 0
  const adminCount = users ? users.filter((user) => user.role === "admin").length : 0




  return (
    <Box>
      <SimpleGrid mt={{ base: "2%", md: "2%" }}
        columns={{ base: 2, md: 4 }}
        spacing={6}
        ml={{ base: "1%", md: "0" }}
        w={"100%"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>

        <CountBox icon={FaBookReader} count={studentCount} title={"No Of Students"} />
        <CountBox icon={FaPen} count={teacherCount} title={"No Of Teachers"} />
        <CountBox icon={FaPersonBooth} count={parentCount} title={"No Of Parents"} />
        <CountBox icon={FaPenAlt} count={adminCount} title={"No Of Admins"} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 3, md: 4 }}
        mt={{ base: "1%", md: "1%" }}
        w={{md:"30%",base:"80%"}}
        // spacing={{base:6,md:""}}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} >
        <Badge title={"student"} bgColor={"green.500"} />
        <Badge title={"parents"} bgColor={"red.500"} />
        <Badge title={"teachers"} bgColor={"blue.500"} />
      </SimpleGrid>


      <Box mt={{ base: "5%", md: "1%" }}>
        <HStack >
          <SearchInput value={searchTerm} placeholder={"search student..."} onChange={handleSearch} />
          <CustomButton onClick={onOpen} leftIcon={<FaUserPlus />} title={"Add Student"} bgColor={"blue.400"} />
        </HStack>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {"oops cant fetch"}</p>
        ) : (
          <CustomTable
            columns={columns}
            data={filteredData}
            onRowClick={(row) => alert(`Student ID: ${row["_id"]}`)}
          />
        )}
        {/* <StudentAdd isOpen={isOpen} onClose={onClose}/> */}
      </Box>
    </Box>
  )
}

export default Dashbord