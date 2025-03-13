import {
  Box,
  Button,
  HStack,
  Select,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetAllEventsQuery } from "../pages/events/eventSlice";
import CustomButton from "./custom/button";
import { FaAddressBook, FaPlus } from "react-icons/fa";
import AddEvent from "./addEvent";
import CustomInputs from "./custom/input";
import SearchInput from "./custom/search";
import "../pages/events/idex.css";

const localizer = momentLocalizer(moment);

const BigCallender = ({ height, width }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentEvent, setCurrentEvent] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited
  const {
    data: events,
    isLoading,
    isError,
  } = useGetAllEventsQuery();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  // State to hold events
  // console.log('events', events)
  const handleAdd = () => {
    onOpen();
    setFormMode("add");
  };
  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setFormMode("edit");
    onOpen(); // Open the event details modal
  };
  const formatedEvent =
    events?.map((event) => ({
      title: `${event.title} `,
      start: new Date(event.start),
      end: new Date(event.end),
      creator: event.createdBy?.name || "Unknown",
      role: event.createdBy?.role || "Unknown",
      id: event._id,
    })) || [];

  const filteredEvents = formatedEvent.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole = selectedRole ? event.role === selectedRole : true;
    return matchesRole && matchesSearch;
  });

  const handleSelectSlot = () => {
    setCurrentEvent({
      title: "",
      start: "",
      end:"",
    });
    setFormMode("add");
    onOpen();
  };
  return (
    <Box flex={1} h={height} w={"100%"} fontSize={{ base: "8px", md: "12px" }}>
      <Box fontSize={{ base: "8px", md: "11px" }}>
        <HStack
          p={{ base: 1, md: 3 }}
          justifyContent={"space-between"}
          w={"100%"}
        >
          {/* <CustomButton
            onClick={handleAdd}
            leftIcon={<FaPlus />}
            bgColor={"blue.300"}
            title={" Event"}
          /> */}
          <>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"search by title...."}
            />
          </>
          <>
            <Select
              fontSize={"12px"}
              placeholder="select by role"
              onChange={(e) => setSelectedRole(e.target.value)}
              w={"10%"}
            >
              <option value={"admin"}>Admin</option>
              <option value={"teacher"}>Teacher</option>
              <option value={"parent"}>parent</option>
            </Select>
          </>
        </HStack>
        {isLoading && <Text>Loading...</Text>}

      </Box>
      <Calendar
        localizer={localizer}
        events={filteredEvents} // Pass the events here
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent} // Handle event click
        // style={{ height: height, width: width, fontSize:"10px"}}
        components={{
          event: ({ event }) => (
            <Box p={{ base: 1, md: 1 }}>
              <Text fontWeight={"bold"}>
                {event.title.length > 20
                  ? `${event.title.slice(0, 20)}...`
                  : event?.title}
                ,{moment(event.start).format("h:mm a")}
              </Text>
            </Box>
          ),
        }}
        // toolbar= {false}
      />
      <AddEvent
        isOpen={isOpen}
        onClose={onClose}
        eventData={currentEvent}
        mode={formMode}
      />
    </Box>
  );
};

export default BigCallender;
