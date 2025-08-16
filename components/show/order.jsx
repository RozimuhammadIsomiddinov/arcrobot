import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
} from "@adminjs/design-system";
import { useNavigate } from "react-router-dom";

const CustomOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchOrders = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/consult", {
        params: { page: pageNum, pageSize },
      });
      setOrders(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  const handleShowClick = (id) => {
    navigate(`/admin/resources/orders/records/${id}/show`);
  };

  if (loading) {
    return <Box padding="xl">Загрузка...</Box>;
  }

  const leftCellStyle = {
    borderRight: "2px solid #ccc",
    fontWeight: "bold",
  };

  return (
    <Box variant="grey" padding="xl">
      <h2 style={{ marginBottom: 20 }}>Консультация</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={leftCellStyle}>Имя</TableCell>
            <TableCell style={leftCellStyle}>Эл. почта</TableCell>
            <TableCell style={leftCellStyle}>Телефон</TableCell>
            <TableCell style={leftCellStyle}>Причина</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell style={leftCellStyle}>{order.id}</TableCell>
                <TableCell style={leftCellStyle}>{order.name}</TableCell>
                <TableCell style={leftCellStyle}>{order.email}</TableCell>
                <TableCell style={leftCellStyle}>
                  {order.phone_number}
                </TableCell>
                <TableCell style={leftCellStyle}>{order.reason}</TableCell>
                <TableCell style={leftCellStyle}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() => handleShowClick(order.id)}
                  >
                    Подробнее
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" marginTop="lg">
          <Pagination
            page={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomOrderList;
