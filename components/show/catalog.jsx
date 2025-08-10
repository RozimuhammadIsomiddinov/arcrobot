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
  const navigate = useNavigate();

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/catalog");
      const data = res.data.data || [];

      const normalized = data.map((item) => ({
        ...item,
        images: Array.isArray(item.images)
          ? item.images
          : typeof item.images === "string" && item.images.startsWith("{")
          ? item.images
              .replace(/[{}]/g, "")
              .split(",")
              .map((url) => url.trim().replace(/^"|"$/g, ""))
          : [],
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

  if (loading) {
    return <Box padding="xl">Загрузка...</Box>;
  }

  // Oddiy chap hujayra style
  const leftCellStyle = { fontWeight: "bold", borderRight: "2px solid #ccc" };

  // Название uchun matnni kesish va maksimal kenglik berish
  const textCellStyle = {
    fontWeight: "bold",
    borderRight: "2px solid #ccc",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 200,
  };

  return (
    <Box variant="grey" padding="xl">
      <h2 style={{ marginBottom: 20 }}>Каталог</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={textCellStyle}>Название</TableCell>
            <TableCell style={leftCellStyle}>Изображения</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {catalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            catalogs.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell style={leftCellStyle}>{catalog.id}</TableCell>
                <TableCell style={textCellStyle} title={catalog.name}>
                  {catalog.name}
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
                    style={{ marginRight: "8px" }}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CatalogList;
