import React, { useState } from "react";
import { Box, Label } from "@adminjs/design-system";

const ShowComponent = ({ record, property }) => {
  const params = record?.params || {};
  console.log("RECORD PARAMS =>", params);

  // Собираем image.0, image.1, ... в массив
  const imageList = Object.keys(params)
    .filter((key) => key.startsWith(`${property.name}.`))
    .map((key) => params[key]);

  if (!imageList || imageList.length === 0) {
    return (
      <Box mt="lg" textAlign="center">
        <Label>🚫 Изображения отсутствуют</Label>
      </Box>
    );
  }

  const [selected, setSelected] = useState(null);

  return (
    <Box mt="lg">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
        gap="25px"
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

export default ShowComponent;
