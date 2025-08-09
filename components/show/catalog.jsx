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

const CatalogList = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/catalog"); // API endpoint catalog uchun
      setCatalogs(res.data.data || []);
    } catch (err) {
      console.error("Ошибка при загрузке данных каталога:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const res = await axios.get(`/catalog/${id}`);
      setSelectedCatalog(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Ошибка при получении деталей каталога:", err);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/admin/resources/catalog/records/${id}/edit`);
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
      <h2 style={{ marginBottom: 20 }}>Каталог</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={leftCellStyle}>Имя</TableCell>
            <TableCell style={leftCellStyle}>Заголовок</TableCell>
            <TableCell style={leftCellStyle}>Изображения</TableCell>
            <TableCell style={leftCellStyle}>Свойства</TableCell>
            <TableCell style={leftCellStyle}>Описание</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {catalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            catalogs.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell style={leftCellStyle}>{catalog.id}</TableCell>
                <TableCell style={leftCellStyle}>{catalog.name}</TableCell>
                <TableCell style={leftCellStyle}>{catalog.title}</TableCell>
                <TableCell style={leftCellStyle}>
                  {Array.isArray(catalog.images) &&
                  catalog.images.length > 0 ? (
                    catalog.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`catalog-img-${idx}`}
                        style={{ height: 40, marginRight: 5, borderRadius: 4 }}
                      />
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell style={leftCellStyle}>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {typeof catalog.property === "string"
                      ? catalog.property
                      : JSON.stringify(catalog.property, null, 2)}
                  </pre>
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {catalog.description}
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {new Date(catalog.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() => handleDetailsClick(catalog.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEditClick(catalog.id)}
                  >
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {modalOpen && selectedCatalog && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} width={700}>
          <Box padding="xl">
            <h1 style={{ marginBottom: 20 }}>
              📄 Детали каталога #{selectedCatalog.id}
            </h1>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={leftCellStyle}>Имя</TableCell>
                  <TableCell>{selectedCatalog.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Заголовок</TableCell>
                  <TableCell>{selectedCatalog.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Изображения</TableCell>
                  <TableCell>
                    {Array.isArray(selectedCatalog.images) &&
                    selectedCatalog.images.length > 0 ? (
                      selectedCatalog.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`catalog-img-${idx}`}
                          style={{
                            maxWidth: 120,
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 6,
                          }}
                        />
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Свойства</TableCell>
                  <TableCell>
                    <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                      {typeof selectedCatalog.property === "string"
                        ? selectedCatalog.property
                        : JSON.stringify(selectedCatalog.property, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Описание</TableCell>
                  <TableCell>{selectedCatalog.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Дата создания</TableCell>
                  <TableCell>
                    {new Date(selectedCatalog.createdAt).toLocaleString()}
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

export default CatalogList;
