import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDeleteUserMutation, useGetAllUsersQuery } from "./login/loginSlice";
import {
  Avatar,
  Box,
  Center,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import SearchInput from "../components/custom/search";
import CustomTable from "../components/custom/table";
import {
  FaBookReader,
  FaEdit,
  FaPen,
  FaPenAlt,
  FaPersonBooth,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import CountBox from "../components/custom/countBox";
import { ErrorToast, LoadingToast, SuccessToast } from "../components/toaster";
import UserForm from "../components/userForm";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import useChartOptions from "../components/custom/chart";
import CustomButton from "../components/custom/button";
import noData from "../assets/nodata.png";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/logout";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
  CategoryScale,
  PointElement,
  LineElement
);

const Dashbord = () => {
  const { colorMode } = useColorMode();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const {
    data: users,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    // pollingInterval: 2000,
  });
  const [deleteUser] = useDeleteUserMutation();

  // useEffect(() => {
  //   if (isError === true && error.status === 401) {
  //     const timeOut = setTimeout(() => {
  //       ErrorToast("Session expired please login again");
  //       handleLogout()
  //       navigate("/");
  //     }, 3000);
  //     return () => clearTimeout(timeOut);
  //   }
  // }, [isError, navigate,error]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  // Define columns for the table
  const columns = [
    {
      header: "name",
      accessor: "name",
      Cell: ({ row }) => (
        <HStack key={row._id} spacing={2} align="center">
          {/* Teacher Avatar */}
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bg="gray.200"
            overflow="hidden"
          >
            {row?.photo ? (
              <Avatar
                src={row.photo}
                name={row.name}
                // size={{ base: "sm", md: "md" }}
                objectFit="cover"
              />
            ) : (
              <Center w="full" h="full" bg="blue.100">
                <Text fontWeight="bold" color="blue.700">
                  {row?.name?.charAt(0) || "?"}
                </Text>
              </Center>
            )}
          </Box>

          {/* Teacher Name & Email */}
          <VStack spacing={0} align="start">
            <Text fontWeight="medium">{row?.name || "No Name"}</Text>
            <Text fontSize={{ base: "12px", md: "2sm" }} color="gray.500">
              {row?.phone || "No phone"}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    { header: "email", accessor: "email" },
    { header: "role", accessor: "role" },
    { header: "phone", accessor: "phone" },
    { header: "Address", accessor: "address" },
    { header: "gender", accessor: "gender" },
    {
      header: "Actions",
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
        );
      },
    },
  ];

  const goBack = () => {
    navigate("/");
  };
  const filteredData = users?.filter((row) =>
    columns.some((col) => {
      const cellValue = row[col.accessor]?.toString().toLowerCase();
      return cellValue?.includes(searchTerm);
    })
  );

  const studentCount = users
    ? users.filter((user) => user.role === "student").length
    : 0;
  const parentCount = users
    ? users.filter((user) => user.role === "parent").length
    : 0;
  const teacherCount = users
    ? users.filter((user) => user.role === "teacher").length
    : 0;
  const adminCount = users
    ? users.filter((user) => user.role === "admin").length
    : 0;
  const usersCount = users ? users.length : 0;

  const graphData = {
    labels: ["Students", "Teachers", "Parents", "Admins", "Total users"],
    datasets: [
      {
        label: "User Distribution",
        data: [studentCount, teacherCount, parentCount, adminCount, usersCount],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0", "red"],
        borderColor: ["#2E7D32", "#F57C00", "#1976D2", "#7B1FA2"], // Optional: Bar borders
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
    setCurrentUser(user);
    setFormMode("edit");
    onOpen();
  };
  const handleAdd = () => {
    setCurrentUser("");
    setFormMode("add");
    onOpen();
  };
  const handleDelete = async (userId) => {
    LoadingToast(true);
    try {
      const response = await deleteUser(userId).unwrap();
      SuccessToast(response.message);
      LoadingToast(false);
    } catch (error) {
      ErrorToast("failed to delete a user");
    } finally {
      LoadingToast(false);
    }
  };
  const chartOptions = useChartOptions;
  return (
    <Box>
      {/* count boxes*/}

      <SimpleGrid
        mt={{ base: "2%", md: "2%" }}
        p={2}
        bgGradient={
          colorMode === "light"
            ? "linear(to-t, #4299E1 , gray.300,white)"
            : "linear(to-t, #4299E1 , gray.800,#1B202D)"
        }
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
        }}
      >
        <CountBox
          color={"#4CAF50"}
          gradient="linear(to-l, #4CAF50,#1c1e22, #1c1e22)"
          icon={FaBookReader}
          count={studentCount}
          title={"No Of Students"}
        />
        <CountBox
          color={"#FF9800"}
          gradient="linear(to-l, #FF9800,#1c1e22, #1c1e22)"
          icon={FaPen}
          count={teacherCount}
          title={"No Of Teachers"}
        />
        <CountBox
          color={"#2196F3"}
          gradient="linear(to-l, #2196F3,#1c1e22, #1c1e22)"
          icon={FaPersonBooth}
          count={parentCount}
          title={"No Of Parents"}
        />
        <CountBox
          color={"#9C27B0"}
          gradient="linear(to-l, #9C27B0,#1c1e22, #1c1e22)"
          icon={FaPenAlt}
          count={adminCount}
          title={"No Of Admins"}
        />
      </SimpleGrid>
      {/* graphs*/}
      <SimpleGrid size={"sm"} columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            User Distribution (Bar Chart)
          </Text>
          <Bar data={graphData} options={chartOptions} />
        </Box>

        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            User Distribution (line Chart)
          </Text>
          <Line data={graphData} options={chartOptions} />
        </Box>
        {/* <Box size={"sm"}>
          <Text fontSize="sm" fontWeight="bold" mb={4}>User Distribution (Pie Chart)</Text>
          <Pie data={pieData} options={chartOptions} />
        </Box> */}
      </SimpleGrid>

      {/* content*/}

      <Box mt={{ base: "5%", md: "1%" }}>
        <HStack>
          <SearchInput
            value={searchTerm}
            placeholder={"search user..."}
            onChange={handleSearch}
          />
          <Spacer />
          <IconButton
            onClick={handleAdd}
            borderRadius={"50%"}
            bg={"blue.400"}
            icon={<FaPlus />}
            size={{ base: "sm", md: "md" }}
          />
        </HStack>
        {isLoading ? (
          <Stack mt={{ base: "2%", md: "2%" }}>
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
            <Skeleton h={"20px"} />
          </Stack>
        ) : isError ? (
          <VStack
            justifyContent={"center"}
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
          >
            <Image src={noData} w={"10%"} h={"10%"} />
            <Text
              mt={{ base: "1%" }}
              fontWeight={"bold"}
              fontSize={{ base: "10px" }}
              alignSelf={"center"}
              color={"red.500"}
            >
              {`Oops something went wrong try agin later... `}
            </Text>
            <VStack mt={"1%"} w={"100%"}>
              <CustomButton
                title={"login"}
                onClick={goBack}
                bgColor={"blue.400"}
                width={"20%"}
              />
            </VStack>
          </VStack>
        ) : (
          <Box mt={{ base: 2 }}>
            <CustomTable columns={columns} data={filteredData} />
          </Box>
        )}
        <UserForm
          isOpen={isOpen}
          onClose={onClose}
          userData={currentUser}
          mode={formMode}
        />
      </Box>
    </Box>
  );
};

export default Dashbord;
