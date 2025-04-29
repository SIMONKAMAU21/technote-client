import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "../pages/events/eventSlice";
import CustomInputs from "./custom/input";
import { ErrorToast, LoadingToast, SuccessToast } from "./toaster";
import { FaTrash } from "react-icons/fa";

const AddEvent = ({ onClose, isOpen, mode, eventData }) => {
  const [addEvent, { isLoading }] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (eventData && mode === "edit") {
      setFormData({
        title: eventData.title || "",
        start: eventData.start
          ? new Date(eventData.start).toISOString().slice(0, 16)
          : "",
        end: eventData.end
          ? new Date(eventData.end).toISOString().slice(0, 16)
          : "",
      });
    } else if (mode === "add") {
      if (!eventData || (!eventData.start && !eventData.end)) {
        setFormData({
          title: "",
          start: "",
          end: "",
        });
      } else {
        setFormData({
          title: "",
          start: eventData.start
            ? new Date(eventData.start).toISOString().slice(0, 16)
            : "",
          end: eventData.end
            ? new Date(eventData.end).toISOString().slice(0, 16)
            : "",
        });
      }
    }
  }, [eventData, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoadingToast(true);
    try {
      if (mode === "add") {
        const response = await addEvent(formData).unwrap();
        SuccessToast(response.message);
        LoadingToast(false);
        setFormData({
          title: "",
          start: "",
          end: "",
        });
        onClose();
      } else if (mode === "edit") {
        const id = eventData.id;
        const response = await updateEvent({ id, ...formData }).unwrap();
        SuccessToast(response.message);
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
      LoadingToast(false);
      setFormData({
        title: "",
        start: "",
        end: "",
      });
    } finally {
      LoadingToast(false);
    }
  };
  const handleDelete = async () => {
    const payload = {
      id: eventData?.id,
    };
    try {
      LoadingToast(true);
      const response = await deleteEvent(payload).unwrap();
      SuccessToast(response.message);
      onClose();
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An error occurred. Please try again.";
      ErrorToast(errorMessage);
    } finally {
      LoadingToast(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        fontSize={{ base: "15px", md: "15px" }}
        w={{ base: "90%", md: "100%" }}
      >
        <ModalHeader display={"flex"} justifyContent={"space-between"}>
          {mode === "add" ? "Add event" : "Edit event"}
          {isDeleting ? (
            <Text>deleting...</Text>
          ) : mode === "add" ? (
            ""
          ) : (
            <FaTrash onClick={handleDelete} />
          )}
        </ModalHeader>
        <ModalBody>
          <Box onSubmit={handleSubmit} w="full" p={4}>
            <VStack as={"form"} spacing={4}>
              <CustomInputs
                label="Event title"
                name="title"
                value={formData.title}
                placeholder={"Enter event title..."}
                fontSize={{ base: "15px", md: "15px" }}
                onChange={handleChange}
                type="text"
              />{" "}
              <CustomInputs
                label="Event start date"
                name="start"
                value={formData.start}
                // placeholder={"Enter class name..."}
                fontSize={{ base: "15px", md: "15px" }}
                onChange={handleChange}
                type="datetime-local"
              />
              <CustomInputs
                label="Event end date"
                name="end"
                value={formData.end}
                // placeholder={"Enter class name..."}
                fontSize={{ base: "15px", md: "15px" }}
                onChange={handleChange}
                type="datetime-local"
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Adding..."
                w="full"
              >
                save
              </Button>
              {mode === "add" ? (
                ""
              ) : (
                <Box>
                  <Text color={"#ed8936"} fontSize={"12px"}>
                    Created by: {eventData?.creator}
                  </Text>
                  <Text color={"#ed8936"} fontSize={"12px"}>
                    Role:
                    {eventData?.role}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddEvent;
