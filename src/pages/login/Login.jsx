import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/Auth";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import CustomInputs from "../../components/custom/input"; // Ensure the correct path
import pencil from "../../assets/pencils.jpg";
import { useLoginMutation } from "./loginSlice";
import {
  ErrorToast,
  LoadingToast,
  SuccessToast,
} from "../../components/toaster";
import useLocalStorage from "../../hooks/useLocalStorage";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "demo123",
    id: "",
  });
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [userDetails, setUserDetails] = useLocalStorage("user", null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "emailOrId") {
      // Check if value looks like an email (contains @ and at least one character before and after @)
      if (value.includes("@") && value.indexOf("@") > 0 && value.indexOf("@") < value.length - 1) {
        setFormData((prev) => ({ ...prev, email: value, id: "" }));
      } 
      // Check if value is numeric only
      else if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, id: value, email: "" }));
      } 
      // For partial email inputs that don't yet have @ but aren't numeric
      else {
        // Treat as potential email if it contains non-numeric characters
        setFormData((prev) => ({ ...prev, email: value, id: "" }));
      }
      
      // Update the common field as well
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.id) {
      ErrorToast("Please enter an email or student ID");
      return;
    }
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        ID: formData.id,
      };
      LoadingToast(true);
      const result = await login(payload).unwrap();
      const response = setUserDetails({
        ...result?.user,
        token: result?.token,
      });

      SuccessToast(result?.message);
      switch (result?.user?.role) {
        case "admin":
          navigate(`/dashboard`);
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        case "parent":
          navigate("/parentDashbord");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;

        default:
          ErrorToast("unknown role. please contact your admin");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
    } finally {
      LoadingToast(false);
    }
  };

  return (
    <AuthWrapper
      leftChildren={
        <Box
          // bg={colorMode === "light" ? "gray.100" : "gray.700"}
          bg={colorMode === "light" ? "gray.100" : "black"}
          p={8}
          rounded="md"
          shadow="lg"
          w="100%"
          h={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <VStack
            boxShadow={"lg"}
            p={2}
            w={{ base: "100%", md: "50%" }}
            spacing={6}
            align="stretch"
          >
            <Heading as="h1" size="lg">
              Login
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
              Welcome back! Please login to access your account.
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack
                w={{ base: "100%", md: "100%" }}
                spacing={4}
                align="stretch"
              >
                <CustomInputs
                  label="Email Address/ student ID"
                  name="emailOrId"
                  placeholder="Enter your email"
                  value={formData.email || formData.id}
                  onChange={handleChange}
                  type="text"
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
        <Box
          bgImage={pencil}
          blur={"3xl"}
          h={"100vh"}
          bgRepeat={"no-repeat"}
          bgSize={"cover"}
          display={"flex"}
          flexDir={"column"}
          justifyContent={"center"}
          textAlign="center"
          p={8}
        >
          <Heading size="4xl" color={"blue.300"}>
            Welcome Back!
          </Heading>
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
