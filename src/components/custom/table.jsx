import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorMode,
} from "@chakra-ui/react";

const CustomTable = ({ columns, data, onRowClick }) => {
  const {colorMode} = useColorMode()
  return (
    <TableContainer bgColor={colorMode === "dark" ?"gray.700" :"gray.100"} p={1} borderRadius={"10px"}>
      <Table size={{base:"sm",md:"sm"}} variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            {columns?.map((col, index) => (
              <Th key={index}>{col.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((row, rowIndex) => (
            <Tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              _hover={{ bg: "yellow.100", color:"black" ,cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map((col, colIndex) => (
                <Td textTransform={"capitalize"} key={colIndex}>
                  {col.Cell ? col.Cell ({row}):
                  row[col.accessor] || "-"} </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
