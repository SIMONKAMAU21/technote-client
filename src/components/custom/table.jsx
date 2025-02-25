import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorMode,
  HStack,
  Button,
  Box,
  Select,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import CustomInputs from "./input";

const CustomTable = ({ columns, data, onRowClick }) => {
  const { colorMode } = useColorMode();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // calculate total pages
  const totalPages = Math.ceil(data?.length / rowsPerPage);
  // slice the data for pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data?.slice(startIndex, startIndex + rowsPerPage);

  const handleInputChange = (e) => {
    const value = Number(e.target.value);

    // Ensure the value is within valid range
    if (value >= 1 && value <= totalPages) {
      setCurrentPage(value);
    }
  };
  return (
    <>
      <HStack justify={"space-between"} mb={"3"}>
        <HStack justifyContent={"space-between"}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            isDisabled={currentPage === totalPages}
          >
            <ChevronRightIcon />
          </Button>
        </HStack>
        <HStack>
          <CustomInputs
            type={"number"}
            onChange={handleInputChange}
            min={1}
            max={totalPages}
            textAlign={"center"}
            height={"20px"}
            width={"60px"}
          />
          <Text>/{totalPages}</Text>
        </HStack>
        <Select
          fontSize={"12px"}
          placeholder=""
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.target.value)}
          w={"10%"}
        >
          <option value={"5"}>5</option>
          <option value={"10"}>10</option>
          <option value={"20"}>20</option>
        </Select>{" "}
      </HStack>
      <TableContainer
        bgColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        p={1}
        borderRadius={"10px"}
      >
        {/* pagination controll */}

        <Table
          size={{ base: "sm", md: "sm" }}
          variant="simple"
          colorScheme="blue"
        >
          <Thead>
            <Tr>
              {columns?.map((col, index) => (
                <Th key={index}>{col.header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {currentRows?.map((row, rowIndex) => (
              <Tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                _hover={{
                  bg: "yellow.100",
                  color: "black",
                  cursor: onRowClick ? "pointer" : "default",
                }}
              >
                {columns.map((col, colIndex) => (
                  <Td textTransform={"capitalize"} key={colIndex}>
                    {col.Cell ? col.Cell({ row }) : row[col.accessor] || "-"}{" "}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
