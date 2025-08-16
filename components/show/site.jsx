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

const SiteList = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSite, setSelectedSite] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/sites"); // API endpoint
      setSites(res.data.data || []);
    } catch (err) {
      console.error("Error fetching sites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const res = await axios.get(`/api/sites/${id}`);
      setSelectedSite(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching site details:", err);
    }
  };
  const handleEditClick = (id) => {
    navigate(`/admin/resources/sites/records/${id}/edit`);
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
      <h2 style={{ marginBottom: 20 }}>Сайты</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={leftCellStyle}>Название</TableCell>
            <TableCell style={leftCellStyle}>Ссылка</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell style={leftCellStyle}>{site.id}</TableCell>
                <TableCell style={leftCellStyle}>{site.name}</TableCell>
                <TableCell style={leftCellStyle}>
                  <a
                    href={site.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1a73e8", textDecoration: "underline" }}
                  >
                    {site.link}
                  </a>
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {new Date(site.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() => handleDetailsClick(site.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEditClick(site.id)}
                  >
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      {modalOpen && selectedSite && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} width={600}>
          <Box padding="xl">
            <h1 style={{ marginBottom: "20px" }}>
              📄 Детали сайта #{selectedSite.id}
            </h1>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={leftCellStyle}>Название</TableCell>
                  <TableCell>{selectedSite.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Ссылка</TableCell>
                  <TableCell>
                    <a
                      href={selectedSite.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1a73e8", textDecoration: "underline" }}
                    >
                      {selectedSite.link}
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Дата создания</TableCell>
                  <TableCell>
                    {new Date(selectedSite.createdAt).toLocaleString()}
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

export default SiteList;
