import React, { useState } from "react";
import { Box, Label } from "@adminjs/design-system";

const CatalogShow = ({ record }) => {
  const params = record?.params || {};
  console.log("CATALOG RECORD =>", params);

  let imageList = [];

  if (params.images) {
    try {
      if (Array.isArray(params.images)) {
        // allaqachon massiv
        imageList = params.images;
      } else if (typeof params.images === "string") {
        let cleaned = params.images.trim();

        // 1) Oddiy JSON massiv bo'lsa
        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
          imageList = JSON.parse(cleaned);
        }
        // 2) Ob'ekt formatida bo'lsa { "0":"url", "1":"url2" }
        else if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
          try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) {
              imageList = parsed;
            } else if (typeof parsed === "object") {
              imageList = Object.values(parsed);
            }
          } catch {
            // Agar parse bo'lmasa, {} ni olib tashlab vergul bo'yicha bo'lamiz
            cleaned = cleaned.replace(/[{}"]/g, "");
            imageList = cleaned
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }
        // 3) Faqat bitta URL bo'lsa
        else {
          cleaned = cleaned.replace(/["{}]/g, "");
          imageList = cleaned
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    } catch (err) {
      console.error("Images parse error:", err);
      imageList = [];
    }
  }

  const [selected, setSelected] = useState(null);

  if (!imageList || imageList.length === 0) {
    return (
      <Box mt="lg" textAlign="center">
        <Label>🚫 Rasm mavjud emas</Label>
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
              alt={`image-${index}`}
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
            alt="big-preview"
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
