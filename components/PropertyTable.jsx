import React from "react";
import { Box, Label } from "@adminjs/design-system";

const PropertyTable = ({ record }) => {
  const params = record?.params || {};

  let propertyObj = {};

  try {
    if (params.property) {
      // 1) Если property строка JSON
      if (typeof params.property === "string") {
        propertyObj = JSON.parse(params.property);
      }
      // 2) Если property объект
      else if (typeof params.property === "object") {
        propertyObj = params.property;
      }
    } else {
      // 3) Собираем ключи вида property.*
      propertyObj = Object.keys(params)
        .filter((key) => key.startsWith("property."))
        .reduce((acc, key) => {
          const cleanKey = key.replace("property.", "");
          acc[cleanKey] = params[key];
          return acc;
        }, {});
    }
  } catch (err) {
    console.error("Ошибка парсинга property:", err);
    propertyObj = {};
  }

  const keys = Object.keys(propertyObj);

  return (
    <Box
      mt="lg"
      p="md"
      style={{
        background: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Label
        style={{
          fontSize: "18px",
          color: "#00695c",
          fontWeight: "bold",
          marginBottom: "10px",
          display: "block",
        }}
      >
        📋 Свойства
      </Label>

      {keys.length === 0 ? (
        <Box mt="md" style={{ color: "#d32f2f", fontSize: "16px" }}>
          🚫 Свойства отсутствуют
        </Box>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px",
            fontSize: "15px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#009688", color: "#fff" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Ключ
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Значение
              </th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#e0f2f1" : "#ffffff",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    color: "#004d40",
                    fontWeight: "600",
                  }}
                >
                  {key}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "#37474f",
                    whiteSpace: "pre-wrap", // чтобы показывать \n
                  }}
                >
                  {propertyObj[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
};

export default PropertyTable;
