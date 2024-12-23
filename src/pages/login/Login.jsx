import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/Auth";
import { Box, VStack, Heading, Text, Button, useToast, useColorMode, Image } from "@chakra-ui/react";
import CustomInputs from "../../components/custom/input"; // Ensure the correct path
import pencil from '../../assets/pencils.jpg'
import { useLoginMutation } from "./loginSlice";
import { ErrorToast, SuccessToast } from "../../components/toaster";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "demo123" });
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      SuccessToast(result?.message)
      switch (result?.user?.role) {
        case "admin":
          navigate('/Dashbord');
          break;
        case "student":
          navigate('/studentDashbord');
          break;
        case "parent":
          navigate('/parentDashbord')
          break;
        case "teacher":
          navigate('/teacherDashbord')
          break;

        default:
          ErrorToast("unknown role. please contact your admin")
      }
    } catch (error) {
      ErrorToast("failed to login")
    }
  };

  return (
    <AuthWrapper
      leftChildren={
        <Box
          bg={colorMode === "light" ? "gray.100" : "gray.700"}
          p={8}
          rounded="md"
          shadow="lg"
          w="100%"
          h={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <VStack boxShadow={"lg"} p={2} w={{ base: "100%", md: "50%" }} spacing={6} align="stretch" >
            <Heading as="h1" size="lg" >
              Login
            </Heading>
            <Text fontSize="md" color="gray.500">
              Welcome back! Please login to access your account.
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack
                w={{ base: "100%", md: "100%" }} spacing={4} align="stretch">
                <CustomInputs
                  label="Email Address"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  width={{ base: "100%", md: "100%" }}
                />
                <CustomInputs
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  width={{ base: "100%", md: "100%" }}

                  type="password"
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Logging in..."
                  size="lg"
                  w="100%"
                >
                  Login
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      }
      rightChildren={
        <Box bgImage={pencil} blur={"3xl"} h={"100vh"} bgRepeat={"no-repeat"} bgSize={"cover"} display={"flex"} flexDir={"column"} justifyContent={"center"} textAlign="center" p={8}>
          <Heading size="4xl" color={"blue.300"}>Welcome Back!</Heading>
          <Text mt={4} fontSize="md" color="gray.800">
            Enter your credentials to access the dashboard.
          </Text>
          {/* <Image src={pencil}/> */}
        </Box>
      }
    />
  );
};

export default Login;
