import React from "react";
import { Box, VStack, HStack, Text, Button, Card, SimpleGrid } from "@chakra-ui/react";
import { FaCalendar, FaMessage } from "react-icons/fa6";
import { FaClipboard, FaInbox, FaUser } from "react-icons/fa";
// import { Calendar, Users, ClipboardList, MessageSquare, FileText } from "lucide-react";

const StudentDashbord = () => {

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Teacher Dashboard</Text>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
        <Card>
          <HStack>
            <FaUser size={30} />
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">My Classes</Text>
              <Text>3 Assigned Classes</Text>
              <Button colorScheme="blue" size="sm">View Classes</Button>
            </VStack>
          </HStack>
        </Card>

        <Card>
          <HStack>
            <FaClipboard size={30} />
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">Assignments</Text>
              <Text>2 Pending Submissions</Text>
              <Button colorScheme="blue" size="sm">Manage</Button>
            </VStack>
          </HStack>
        </Card>

        <Card>
          <HStack>
            <FaCalendar size={30} />
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">Class Schedule</Text>
              <Text>Upcoming: Math - 10:00 AM</Text>
              <Button colorScheme="blue" size="sm">View Schedule</Button>
            </VStack>
          </HStack>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt={5}>
        <Card>
          <HStack>
            <FaInbox size={30} />
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">Student Reports</Text>
              <Text>Generate & View Reports</Text>
              <Button colorScheme="blue" size="sm">View Reports</Button>
            </VStack>
          </HStack>
        </Card>

        <Card>
          <HStack>
            <FaMessage size={30} />
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">Messages</Text>
              <Text>5 New Messages</Text>
              <Button colorScheme="blue" size="sm">Open Messages</Button>
            </VStack>
          </HStack>
        </Card>
      </SimpleGrid>
    </Box>
  );
};



export default StudentDashbord