import React, { useState } from "react";
import { Box, Label } from "@adminjs/design-system";

const CatalogShow = ({ record }) => {
  const params = record?.params || {};
  console.log("CATALOG RECORD =>", params);

  let imageList = [];

  if (params.images) {
    try {
      if (Array.isArray(params.images)) {
        // уже массив
        imageList = params.images;
      } else if (typeof params.images === "string") {
        let cleaned = params.images.trim();

        // 1) Обычный JSON массив
        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
          imageList = JSON.parse(cleaned);
        }
        // 2) В формате объекта { "0":"url", "1":"url2" }
        else if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
          try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) {
              imageList = parsed;
            } else if (typeof parsed === "object") {
              imageList = Object.values(parsed);
            }
          } catch {
            // если не парсится, убираем {} и делим по запятой
            cleaned = cleaned.replace(/[{}"]/g, "");
            imageList = cleaned
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }
        // 3) Если только один URL
        else {
          cleaned = cleaned.replace(/["{}]/g, "");
          imageList = cleaned
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    } catch (err) {
      console.error("Ошибка парсинга изображений:", err);
      imageList = [];
    }
  }

  const [selected, setSelected] = useState(null);

  if (!imageList || imageList.length === 0) {
    return (
      <Box mt="lg" textAlign="center">
        <Label>🚫 Изображения отсутствуют</Label>
      </Box>
    );
  }

  return (
    <Box mt="lg">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
        gap="20px"
      >
        {imageList.map((file, index) => (
          <Box
            key={index}
            style={{
              width: "120px",
              height: "120px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
            onClick={() => setSelected(file)}
          >
            <img
              src={file}
              alt={`изображение-${index}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}
      </Box>

      {selected && (
        <Box
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img
            src={selected}
            alt="увеличенный просмотр"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0,0,0,0.6)",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CatalogShow;
