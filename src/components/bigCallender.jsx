import { Box, Button, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetAllEventsQuery } from '../pages/events/eventSlice';
import CustomButton from './custom/button';
import { FaAddressBook } from 'react-icons/fa';
import AddEvent from './addEvent';

const localizer = momentLocalizer(moment);

const BigCallender = ({ height, width }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isEventOpen, onOpen: onEventOpen, onClose: onEventClose } = useDisclosure();
 const [currentEvent, setCurrentEvent] = useState(null); // Track the user being edited
  const [formMode, setFormMode] = useState(null); // Track the user being edited

  const { data: events, isFetching, isLoading, isError } = useGetAllEventsQuery()
  const [selectedEvent, setSelectedEvent] = useState(null);

  // State to hold events

  const handleAdd = () => {
    onOpen()
    setFormMode("add")
  }
  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setFormMode("edit")
    onOpen(); // Open the event details modal
};
  const formatedEvent = events?.map(event => ({
    title: `${event.title} `,
    start: new Date(event.start),
    end: new Date(event.end),
    creator: event.createdBy?.name || "Unknown",
    role: event.createdBy?.role || "Unknown"
  })) || []

  return (
    <Box flex={1} h={300} fontSize={{ base: "8px", md: "11px" }} overflow={"scroll"}>
      <Box fontSize={{ base: "8px", md: "11px" }}>
        <CustomButton onClick={handleAdd} leftIcon={<FaAddressBook />} bgColor={"blue.300"} title={"Add a new event"} />

      </Box>
      <Calendar
        localizer={localizer}
        events={formatedEvent}  // Pass the events here
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent} // Handle event click
        // style={{ height: height, width: width, fontSize:"10px"}}
        components={{
          event: ({ event }) => (
            <Tooltip label={`Created by: ${event.creator} (${event.role})`} aria-label="A tooltip">
              <span>{event.title}</span>
            </Tooltip>
          )
        }}
      />
      <AddEvent isOpen={isOpen} onClose={onClose} eventData={currentEvent} mode={formMode}/>
    </Box>
  );
};

export default BigCallender;
