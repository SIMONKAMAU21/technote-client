import React, { useState } from 'react'
import { useDeleteUserMutation, useGetAllUsersQuery } from './login/loginSlice'
import { Box, HStack, Icon, IconButton, SimpleGrid, Skeleton, Spacer, Stack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import SearchInput from '../components/custom/search'
import CustomTable from '../components/custom/table'
import { FaAd, FaBookReader, FaEdit, FaPen, FaPenAlt, FaPersonBooth, FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa'
import CountBox from '../components/custom/countBox'
import Badge from '../components/custom/badge'
import { ErrorToast, LoadingToast, SuccessToast } from '../components/toaster'
import UserForm from '../components/userForm'
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import useChartOptions from '../components/custom/chart'
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, BarElement, CategoryScale, PointElement, LineElement);

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
  const usersCount = users ? users.length : 0
  const graphData = {
    labels: ['Students', 'Teachers', 'Parents', 'Admins','Total users'],
    datasets: [
      {
        label: 'User Distribution',
        data: [studentCount, teacherCount, parentCount, adminCount,usersCount],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0',"red"],
        borderColor: ['#2E7D32', '#F57C00', '#1976D2', '#7B1FA2'], // Optional: Bar borders
        borderWidth: 1, // Optional: Border thickness

      },
    ],
  };

  // const pieData = {
  //   labels: ['Students', 'Teachers', 'Parents', 'Admins'],
  //   datasets: [
  //     {
  //       data: [studentCount, teacherCount, parentCount, adminCount],
  //       backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'],
  //     },
  //   ],
  // };

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
  const chartOptions = useChartOptions
  return (
    <Box>
      {/* count boxes*/}

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

        <CountBox color={"#4CAF50"} gradient="linear(to-l, #4CAF50,#1c1e22, #1c1e22)"
          icon={FaBookReader} count={studentCount} title={"No Of Students"} />
        <CountBox color={"#FF9800"} gradient="linear(to-l, #FF9800,#1c1e22, #1c1e22)" icon={FaPen} count={teacherCount} title={"No Of Teachers"} />
        <CountBox color={'#2196F3'} gradient="linear(to-l, #2196F3,#1c1e22, #1c1e22)" icon={FaPersonBooth} count={parentCount} title={"No Of Parents"} />
        <CountBox color={'#9C27B0'} gradient="linear(to-l, #9C27B0,#1c1e22, #1c1e22)" icon={FaPenAlt} count={adminCount} title={"No Of Admins"} />
      </SimpleGrid>
      {/* graphs*/}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={3} mt={8}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>User Distribution (Bar Chart)</Text>
          <Bar data={graphData} options={chartOptions} />
        </Box>

        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>User Distribution (line Chart)</Text>
          <Line data={graphData} options={chartOptions} />
        </Box>
      </SimpleGrid>

      {/* content*/}

      <Box mt={{ base: "5%", md: "1%" }}>
        <HStack >
          <SearchInput value={searchTerm} placeholder={"search user..."} onChange={handleSearch} />
          <Spacer />
          <IconButton onClick={handleAdd} borderRadius={"50%"} bg={"blue.400"} icon={<FaPlus />} size={{ base: "sm", md: "md" }} />
        </HStack>
        {isLoading ? (
          <Stack mt={{ base: "2%", md: "2%" }}>
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
          </Stack>

        ) : isError ? (
          <Text mt={{ base: "2%" }} fontWeight={"bold"} alignSelf={"center"} color={"red.500"}> {"Oops something went wrong try agin later... "}</Text>
        ) : (
         <Box mt={{base:2}}>
           <CustomTable
            columns={columns}
            data={filteredData}

          />
         </Box>
        )}
        <UserForm isOpen={isOpen} onClose={onClose} userData={currentUser} mode={formMode} />
      </Box>
    </Box>
  )
}

export default Dashbord