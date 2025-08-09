import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@adminjs/design-system";

const OrderShow = (props) => {
  const { record } = props;

  if (!record) {
    return <Box padding="xl">Данные не найдены</Box>;
  }

  const { id, name, email, phone_number, reason, createdAt, updatedAt } =
    record.params;

  return (
    <Box
      variant="grey"
      padding="xl"
      style={{ maxWidth: "700px", margin: "auto" }}
    >
      <h1 style={{ marginBottom: "20px" }}>📄 Детали заказа #{id}</h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                fontWeight: "bold",
                width: "30%",
                borderRight: "2px solid #ccc",
              }}
            >
              Имя
            </TableCell>
            <TableCell>{name || "—"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", borderRight: "2px solid #ccc" }}
            >
              Эл. почта
            </TableCell>
            <TableCell>{email || "—"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", borderRight: "2px solid #ccc" }}
            >
              Телефон
            </TableCell>
            <TableCell>{phone_number || "—"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", borderRight: "2px solid #ccc" }}
            >
              Причина
            </TableCell>
            <TableCell>{reason || "—"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", borderRight: "2px solid #ccc" }}
            >
              Дата создания
            </TableCell>
            <TableCell>
              {createdAt ? new Date(createdAt).toLocaleString() : "—"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{ fontWeight: "bold", borderRight: "2px solid #ccc" }}
            >
              Дата обновления
            </TableCell>
            <TableCell>
              {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default OrderShow;
