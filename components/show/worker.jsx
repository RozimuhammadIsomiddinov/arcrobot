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
  Modal,
} from "@adminjs/design-system";
import { useNavigate } from "react-router-dom";

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/worker"); // API endpoint
      setWorkers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const res = await axios.get(`/api/worker/${id}`);
      setSelectedWorker(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching worker details:", err);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/admin/resources/worker/records/${id}/edit`);
  };

  if (loading) {
    return <Box padding="xl">Загрузка...</Box>;
  }

  const leftCellStyle = {
    fontWeight: "bold",
    borderRight: "2px solid #ccc",
  };

  return (
    <Box variant="grey" padding="xl">
      <h2 style={{ marginBottom: 20 }}>Работники</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={leftCellStyle}>Имя</TableCell>
            <TableCell style={leftCellStyle}>Тип сотрудника</TableCell>{" "}
            {/* Qo'shildi */}
            <TableCell style={leftCellStyle}>Фото</TableCell>
            <TableCell style={leftCellStyle}>Описание</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            workers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell style={leftCellStyle}>{worker.id}</TableCell>
                <TableCell style={leftCellStyle}>{worker.name}</TableCell>
                <TableCell style={leftCellStyle}>
                  {worker.worker_type}
                </TableCell>{" "}
                {/* Qo'shildi */}
                <TableCell style={leftCellStyle}>
                  {worker.image ? (
                    <img
                      src={worker.image}
                      alt={worker.name}
                      style={{ height: 40, borderRadius: 4 }}
                    />
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {worker.description?.slice(0, 50)}...
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {new Date(worker.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() => handleDetailsClick(worker.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEditClick(worker.id)}
                  >
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {modalOpen && selectedWorker && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} width={700}>
          <Box padding="xl" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <h1 style={{ marginBottom: 20 }}>
              👷 Детали работника #{selectedWorker.id}
            </h1>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={leftCellStyle}>Имя</TableCell>
                  <TableCell>{selectedWorker.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Тип сотрудника</TableCell>{" "}
                  {/* Qo'shildi */}
                  <TableCell>{selectedWorker.worker_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Фото</TableCell>
                  <TableCell>
                    {selectedWorker.image ? (
                      <img
                        src={selectedWorker.image}
                        alt={selectedWorker.name}
                        style={{ maxWidth: 150, borderRadius: 6 }}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Описание</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedWorker.description,
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Дата создания</TableCell>
                  <TableCell>
                    {new Date(selectedWorker.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box display="flex" justifyContent="flex-end" marginTop="lg">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Закрыть
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default WorkerList;
