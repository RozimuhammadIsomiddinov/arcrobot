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
} from "@adminjs/design-system";
import { useNavigate } from "react-router-dom";

const CatalogList = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHomeIds, setSelectedHomeIds] = useState([]);
  const [showOnlyHome, setShowOnlyHome] = useState(false);
  const [sortAsc, setSortAsc] = useState(true); // 🔹 Yangi holat
  const navigate = useNavigate();

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/catalog");
      const data = res.data.data || [];

      const normalizeArray = (field) => {
        if (Array.isArray(field)) return field;
        if (typeof field === "string" && field.startsWith("{")) {
          return field
            .replace(/[{}]/g, "")
            .split(",")
            .map((url) => url.trim().replace(/^"|"$/g, ""));
        }
        return [];
      };

      const normalized = data.map((item) => ({
        ...item,
        images: normalizeArray(item.images),
        other_images: normalizeArray(item.other_images),
      }));

      setCatalogs(normalized);
    } catch (err) {
      console.error("Error fetching catalogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const toggleSelect = (id) => {
    setSelectedHomeIds((prev) =>
      prev.includes(id) ? prev.filter((hid) => hid !== id) : [...prev, id]
    );
  };

  const setAsHome = async (id) => {
    try {
      await axios.post("/api/catalog/home", { id });
      setCatalogs((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, isHome: true } : cat))
      );
      setSelectedHomeIds((prev) => prev.filter((hid) => hid !== id));
    } catch (err) {
      console.error("Error setting catalog as home:", err);
    }
  };

  const removeFromHome = async (id) => {
    try {
      await axios.delete(`/api/catalog/home/${id}`);
      setCatalogs((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, isHome: false } : cat))
      );
      setSelectedHomeIds((prev) => prev.filter((hid) => hid !== id));
    } catch (err) {
      console.error("Error removing catalog from home:", err);
    }
  };

  if (loading) return <Box padding="xl">Загрузка...</Box>;

  const leftCellStyle = { fontWeight: "bold", borderRight: "2px solid #ccc" };
  const textCellStyle = {
    fontWeight: "bold",
    borderRight: "2px solid #ccc",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 200,
  };

  // 🔽 Avval home filtrini qo‘llaymiz
  const filteredCatalogs = showOnlyHome
    ? catalogs.filter((cat) => cat.isHome)
    : catalogs;

  // 🔽 key bo‘yicha saralaymiz
  const sortedCatalogs = [...filteredCatalogs].sort((a, b) => {
    const valA = a.order_key ?? 0;
    const valB = b.order_key ?? 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <Box variant="grey" padding="xl">
      <h2 style={{ marginBottom: 20 }}>Каталог</h2>

      {/* Faqat home & Saralash tugmalari */}
      <Box marginBottom="lg" display="flex" justifyContent="space-between">
        <label>
          <input
            type="checkbox"
            checked={showOnlyHome}
            onChange={() => setShowOnlyHome((p) => !p)}
          />{" "}
          Показать только домашнюю страницу
        </label>

        <Box display="flex" gap="md">
          <Button
            size="sm"
            variant={sortAsc ? "primary" : "outlined"}
            onClick={() => setSortAsc(true)}
          >
            ↑ По порядку (возрастание)
          </Button>
          <Button
            size="sm"
            variant={!sortAsc ? "primary" : "outlined"}
            onClick={() => setSortAsc(false)}
          >
            ↓ По порядку (убывание)
          </Button>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={textCellStyle}>Название</TableCell>
            <TableCell style={leftCellStyle}>Порядок</TableCell>
            <TableCell style={leftCellStyle}>Изображения</TableCell>
            <TableCell style={leftCellStyle}>Доп. изображения</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
            <TableCell>Home</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedCatalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            sortedCatalogs.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell style={leftCellStyle}>{catalog.id}</TableCell>
                <TableCell style={textCellStyle} title={catalog.name}>
                  {catalog.name}
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {catalog.order_key ?? "—"}
                </TableCell>

                <TableCell style={leftCellStyle}>
                  {catalog.images.length > 0 ? (
                    catalog.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`catalog-img-${idx}`}
                        style={{
                          height: 40,
                          marginRight: 5,
                          borderRadius: 4,
                          objectFit: "cover",
                        }}
                      />
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>

                <TableCell style={leftCellStyle}>
                  {catalog.other_images.length > 0 ? (
                    catalog.other_images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`other-img-${idx}`}
                        style={{
                          height: 40,
                          marginRight: 5,
                          borderRadius: 4,
                          objectFit: "cover",
                        }}
                      />
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>

                <TableCell style={leftCellStyle}>
                  {new Date(catalog.createdAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/admin/resources/catalog/records/${catalog.id}/show`
                      )
                    }
                    style={{ marginRight: 8 }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `/admin/resources/catalog/records/${catalog.id}/edit`
                      )
                    }
                  >
                    Редактировать
                  </Button>
                </TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  {catalog.isHome ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeFromHome(catalog.id)}
                    >
                      Удалить дом
                    </Button>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={selectedHomeIds.includes(catalog.id)}
                        onChange={() => toggleSelect(catalog.id)}
                      />
                      {selectedHomeIds.includes(catalog.id) && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => setAsHome(catalog.id)}
                          style={{ marginLeft: 5 }}
                        >
                          Установить домой
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CatalogList;
