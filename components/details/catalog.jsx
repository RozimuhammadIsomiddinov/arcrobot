import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@adminjs/design-system";

const CatalogDetails = (props) => {
  const { record } = props;
  const id = record?.params?.id;
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  const parseArray = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return field
          .replace(/[{}]/g, "")
          .split(",")
          .map((url) => url.trim().replace(/^"|"$/g, ""));
      }
    }
    return [];
  };

  useEffect(() => {
    if (!id) return;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get(`/api/catalog/${id}`);
        const data = res.data;

        const images = parseArray(data.images);
        const other_images = parseArray(data.other_images);

        let property = {};
        if (typeof data.property === "string") {
          try {
            property = JSON.parse(data.property || "{}");
          } catch {
            property = {};
          }
        } else {
          property = data.property || {};
        }

        setCatalog({
          ...data,
          images,
          other_images,
          property,
        });
      } catch (err) {
        console.error("Error fetching catalog:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [id]);

  if (loading)
    return (
      <Box padding="xl" style={{ color: "#fff" }}>
        ⏳ Загрузка...
      </Box>
    );
  if (!catalog)
    return (
      <Box padding="xl" style={{ color: "#fff" }}>
        ❌ Данные не найдены
      </Box>
    );

  const cardStyle = {
    background: "#1e1e1e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    marginBottom: "20px",
    color: "#fff",
  };

  const propertyTable = (property) => {
    if (!property || typeof property !== "object") return <span>—</span>;
    return (
      <Table style={{ border: "1px solid #333", color: "#fff" }}>
        <TableBody>
          {Object.entries(property).map(([key, value], idx) => (
            <TableRow key={idx}>
              <TableCell
                style={{
                  fontWeight: "bold",
                  background: "#2a2a2a",
                  color: "#fff",
                  width: "200px",
                  borderRight: "1px solid #444",
                }}
              >
                {key}
              </TableCell>
              <TableCell style={{ background: "#1e1e1e", color: "#ccc" }}>
                {String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderImages = (arr, label, clickable = false) => (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: 15 }}>{label}</h2>
      {arr.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {arr.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${label}-${idx}`}
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                border: "1px solid #333",
                cursor: clickable ? "pointer" : "default",
              }}
              onClick={() => {
                if (clickable) {
                  window.location.href = `/admin/pages/about?image_url=${encodeURIComponent(
                    img
                  )}&id=${catalog.id}`;
                }
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/150x100?text=No+Image";
              }}
            />
          ))}
        </div>
      ) : (
        <span>—</span>
      )}
    </div>
  );

  return (
    <Box
      padding="xl"
      style={{
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>📄 Детали каталога #{catalog.id}</h1>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: 15 }}> Основная информация</h2>
        <Table style={{ color: "#fff" }}>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Название
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>{catalog.name}</TableCell>
            </TableRow>

            {/* ✅ Yangi qator: order_key */}
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Порядковый номер
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.order_key ?? "—"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Подзаголовок
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.subtitle ? catalog.subtitle : "—"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Описание
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: catalog.description }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Цена
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.price ? catalog.price + " сум" : "—"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Есть наличными?
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.isDiscount ? "✅ Да" : "❌ Нет"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Доставка (дни)
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.delivery_days ? catalog.delivery_days + " дней" : "—"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Срок хранения (дни)
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {catalog.storage_days ? catalog.storage_days + " дней" : "—"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#fff" }}>
                Дата создания
              </TableCell>
              <TableCell style={{ color: "#ccc" }}>
                {new Date(catalog.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {renderImages(catalog.images, "Изображения", false)}

      {renderImages(
        catalog.other_images,
        "Дополнительные изображения (MARKER)",
        true
      )}

      <div style={cardStyle}>
        <h2 style={{ marginBottom: 15 }}>Свойства</h2>
        {catalog.property && Object.keys(catalog.property).length > 0 ? (
          propertyTable(catalog.property)
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            Свойства не указаны
          </span>
        )}
      </div>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.history.back()}
          style={{
            background: "#2196F3",
            border: "none",
            padding: "6px 14px",
            borderRadius: "6px",
            color: "white",
          }}
        >
          ⬅ Назад
        </Button>
      </Box>
    </Box>
  );
};

export default CatalogDetails;
