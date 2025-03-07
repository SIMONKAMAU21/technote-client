import React from "react";
import Header from "./header";
import { Route, Routes, useParams } from "react-router-dom";
import { Box, HStack, useBreakpointValue } from "@chakra-ui/react";
import Dashbord from "../pages/Dashbord";
import Students from "../pages/student/students";
import Teachers from "../pages/teacher/teachers";
import Settings from "../pages/setting/settings";
import Classes from "../pages/classes/classes";
import StudentDashbord from "../pages/studentDahbord/dashbord";
import TeacherDashbord from "../pages/teacherDashbord/teachers";

const Maincontent = () => {
  const marginLeft = useBreakpointValue({ base: "0", md: "15%" });

  return (
    <>
      <Header />
      <HStack align="start" spacing={0} mt="60px">
        <Box flex="2" p={4} ml={marginLeft} w="100%" overflow="hidden">
          <Routes>
            <Route path="/dashboard" element={<Dashbord />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/calender" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/student/dashboard" element={<StudentDashbord />} />
            <Route path="/teacher/dashboard" element={<TeacherDashbord />} />
          </Routes>
        </Box>
      </HStack>
    </>
  );
};

export default Maincontent;
