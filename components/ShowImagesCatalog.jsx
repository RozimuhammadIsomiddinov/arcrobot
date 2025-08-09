import React, { useState } from "react";
import { Box, Label } from "@adminjs/design-system";

const CatalogShow = ({ record }) => {
  const params = record?.params || {};
  console.log("CATALOG RECORD images =>", params.images);

  let imageList = [];

  try {
    const images = params.images;

    if (!images || images === "{}") {
      imageList = [];
    }
    // 1) Agar allaqachon massiv bo‘lsa
    else if (Array.isArray(images)) {
      imageList = images;
    }
    // 2) Agar object bo‘lsa
    else if (typeof images === "object") {
      imageList = Object.values(images);
    }
    // 3) Agar string bo‘lsa
    else if (typeof images === "string") {
      let cleaned = images.trim();

      // PostgreSQL array: {url1,url2} yoki {"url1","url2"}
      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
        cleaned = cleaned.slice(1, -1); // qavslarni olib tashlaymiz
        imageList = cleaned
          .split(",")
          .map((s) => s.replace(/(^"|"$)/g, "").trim()) // qo'shtirnoqlarni olib tashlash
          .filter(Boolean);
      }
      // JSON array: ["url1", "url2"]
      else if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
        imageList = JSON.parse(cleaned);
      }
      // JSON object: {"0": "url1", ...}
      else if (cleaned.startsWith("{") && cleaned.includes(":")) {
        const parsed = JSON.parse(cleaned);
        imageList = Object.values(parsed);
      }
      // Faqat bitta URL bo‘lsa
      else {
        imageList = [cleaned.replace(/"/g, "")];
      }
    }
  } catch (err) {
    console.error("❌ Ошибка обработки images:", err);
    imageList = [];
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

      {/* Modal preview */}
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
