import React, { useState } from 'react'
import { useDeleteUserMutation, useGetAllUsersQuery } from './login/loginSlice'
import { Box, HStack, Icon, IconButton, SimpleGrid, Spacer, Text, useDisclosure, VStack } from '@chakra-ui/react'
import SearchInput from '../components/custom/search'
import CustomTable from '../components/custom/table'
import { FaAd, FaBookReader, FaEdit, FaPen, FaPenAlt, FaPersonBooth, FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa'
import CountBox from '../components/custom/countBox'
import Badge from '../components/custom/badge'
import { ErrorToast, LoadingToast, SuccessToast } from '../components/toaster'
import UserForm from '../components/userForm'

const Dashbord = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentUser, setCurrentUser] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const { data: users, isFetching, isLoading, isError } = useGetAllUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
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
    {
      header: 'Actions',
      // accessor: '_id',
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
      },
    },
  ];



  const filteredData = users?.filter((row) => columns.some((col) => {
    const cellValue = row[col.accessor]?.toString().toLowerCase()
    return cellValue?.includes(searchTerm)
  }))

  const studentCount = users ? users.filter((user) => user.role === "student").length : 0
  const parentCount = users ? users.filter((user) => user.role === "parent").length : 0
  const teacherCount = users ? users.filter((user) => user.role === "teacher").length : 0
  const adminCount = users ? users.filter((user) => user.role === "admin").length : 0

  const handleEdit = (user) => {
    setCurrentUser(user)
    setFormMode("edit")
  onOpen()
  };
  const handleAdd = () => {
    setCurrentUser("")
    setFormMode("add")
  onOpen()
  }; 
  const handleDelete = async (userId) => {
    LoadingToast(true)
    try {
      const response = await deleteUser(userId).unwrap()
      SuccessToast(response.message)
      LoadingToast(false)
    } catch (error) {
      ErrorToast("failed to delete a user")

    } finally {
      LoadingToast(false)
    }
  }
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
        w={{ md: "30%", base: "80%" }}
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
          <Spacer />
          {/* <CustomButton onClick={onOpen} leftIcon={<FaUserPlus />} title={"Add user"} bgColor={"blue.400"} /> */}
          <IconButton  onClick={handleAdd} borderRadius={"50%"} bg={"blue.400"} icon={<FaPlus />} size={{ base: "sm", md: "md" }} />
        </HStack>
        {isLoading ? (
          <p>Loading...
          </p>
        ) : isError ? (
          <Text mt={{ base: "2%" }} fontWeight={"bold"} alignSelf={"center"} color={"red.500"}> {"Oops something went wrong check your internet connection and try again .... "}</Text>
        ) : (
          <CustomTable
            columns={columns}
            data={filteredData}
            
          />
        )}
        <UserForm isOpen={isOpen} onClose={onClose} userData={currentUser} mode={formMode} />
      </Box>
    </Box>
  )
}

export default Dashbord