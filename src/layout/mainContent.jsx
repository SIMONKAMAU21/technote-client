import React, { lazy, Suspense } from "react";
import Header from "./header";
import { Route, Routes, useParams } from "react-router-dom";
import {
  Box,
  HStack,
  SkeletonCircle,
  SkeletonText,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";

const Maincontent = () => {
  const Dashbord = lazy(() => import("../pages/Dashbord"));
  const Students = lazy(() => import("../pages/student/students"));
  const Teachers = lazy(() => import("../pages/teacher/teachers"));
  const Settings = lazy(() => import("../pages/setting/settings"));
  const Classes = lazy(() => import("../pages/classes/classes"));
  const StudentDashbord = lazy(() =>
    import("../pages/studentDahbord/dashbord")
  );
  const TeacherDashbord = lazy(() =>
    import("../pages/teacherDashbord/teachers")
  );

  const marginLeft = useBreakpointValue({ base: "0", md: "15%" });

  return (
    <>
      <Header />
      <HStack align="start" spacing={0} mt="60px">
        <Box
          flex="2"
          p={{ base: 1, md: 4 }}
          ml={marginLeft}
          w="100%"
          overflow="hidden"
        >
          <Suspense
            fallback={
              <VStack h="100vh" width={{ base: "90vw", md: "80vw" }}>
                <Box padding="6" boxShadow="lg" h="100%" w="100%">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={8}
                    spacing="4"
                    skeletonHeight="8"
                  />
                </Box>
              </VStack>
            }
          >
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
          </Suspense>
        </Box>
      </HStack>
    </>
  );
};

export default Maincontent;
