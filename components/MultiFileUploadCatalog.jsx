import React, { useState } from "react";
import { Box, Label, Button, Input, TextArea } from "@adminjs/design-system";
import axios from "axios";
import ReactJson from "react-json-view";

// вспомогательная функция: null или неверные значения переводит в строки
const convertValuesToString = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in copy) {
    if (copy[key] === null) {
      copy[key] = "";
    } else if (typeof copy[key] === "object") {
      copy[key] = convertValuesToString(copy[key]);
    } else {
      copy[key] = String(copy[key]);
    }
  }
  return copy;
};

const CatalogUpload = ({ record, onChange }) => {
  // Name, Title, Description
  const [name, setName] = useState(record?.params?.name || "");
  const [title, setTitle] = useState(record?.params?.title || "");
  const [description, setDescription] = useState(
    record?.params?.description || ""
  );

  // Property (безопасный JSON parse)
  const [property, setProperty] = useState(() => {
    try {
      return record?.params?.property ? JSON.parse(record.params.property) : {};
    } catch (err) {
      console.warn("Property не JSON, используется fallback:", err);
      return {};
    }
  });

  // Изображения
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);
  const [uploaded, setUploaded] = useState(() => {
    try {
      return record?.params?.images ? JSON.parse(record.params.images) : [];
    } catch {
      return [];
    }
  });

  // безопасный onChange
  const safeOnChange = (field, value) => {
    if (typeof onChange === "function") {
      onChange(field, value);
    }
  };

  // Выбор файла
  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  // Добавить поле
  const addInput = () => {
    if (inputs.length >= 10) {
      return alert("Максимум можно загрузить 10 изображений!");
    }
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  // Сохранить
  const handleUpload = async () => {
    const files = inputs.map((i) => i.file).filter(Boolean);
    if (!files.length) {
      return alert("Выберите хотя бы одно изображение!");
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      formData.append("name", name);
      formData.append("title", title);
      formData.append("property", JSON.stringify(property));
      formData.append("description", description);

      const res = await axios.post(
        `${window.location.origin}/upload-multi-catalog`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const images = res.data.data.images || [];
      setUploaded(images);

      safeOnChange("images", JSON.stringify(images));
      safeOnChange("name", name);
      safeOnChange("title", title);
      safeOnChange("property", JSON.stringify(property));
      safeOnChange("description", description);

      alert("Каталог успешно сохранен!");
      window.location.href = "http://localhost:7007/admin/resources/catalog";
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="70%">
        <Label>Название</Label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            safeOnChange("name", e.target.value);
          }}
          placeholder="Введите название"
        />
      </Box>

      {/* Title */}
      <Box mb="md" width="70%">
        <Label>Заголовок</Label>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            safeOnChange("title", e.target.value);
          }}
          placeholder="Введите заголовок"
        />
      </Box>

      {/* Property */}
      <Box mb="md" width="70%">
        <Label>Свойства (JSON)</Label>
        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            background: "#f9f9f9",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          <ReactJson
            src={property}
            name={false}
            theme="rjv-default"
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
            }}
            collapsed={false}
            displayDataTypes={false}
            onEdit={(edit) => {
              const updated = convertValuesToString(edit.updated_src);
              setProperty(updated);
              safeOnChange("property", JSON.stringify(updated));
            }}
            onAdd={(add) => {
              const updated = convertValuesToString(add.updated_src);
              setProperty(updated);
              safeOnChange("property", JSON.stringify(updated));
            }}
            onDelete={(del) => {
              const updated = convertValuesToString(del.updated_src);
              setProperty(updated);
              safeOnChange("property", JSON.stringify(updated));
            }}
          />
        </Box>

        {/* Скрытое поле */}
        <input
          type="hidden"
          value={JSON.stringify(property)}
          onChange={() => {}}
          name="property"
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="70%">
        <Label>Описание</Label>
        <TextArea
          rows={6}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            safeOnChange("description", e.target.value);
          }}
          placeholder="Введите описание"
        />
      </Box>

      {/* Изображения */}
      <Label mb="lg" style={{ fontSize: "20px", fontWeight: "bold" }}>
        Изображения (максимум 10)
      </Label>

      {inputs.map((input, index) => (
        <Box
          key={input.id}
          mb="md"
          style={{
            backgroundColor: "rgba(165, 231, 214, 0.8)",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            width: "70%",
          }}
        >
          <label
            style={{
              display: "inline-block",
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📂 Выбрать файл
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>

          {input.file && (
            <>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                Файл {input.file.name} выбран
              </span>
              <img
                src={URL.createObjectURL(input.file)}
                alt="preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}
        </Box>
      ))}

      <Button
        type="button"
        mt="lg"
        onClick={addInput}
        style={{ backgroundColor: "rgba(20, 185, 211, 0.8)", color: "white" }}
      >
        ➕ Добавить изображение
      </Button>

      <Button
        type="button"
        mt="lg"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          handleUpload();
        }}
      >
        🚀 Сохранить
      </Button>

      {Array.isArray(uploaded) && uploaded.length > 0 && (
        <ul style={{ marginTop: "20px", textAlign: "center" }}>
          {uploaded.map((file, idx) => (
            <li key={idx}>
              <a href={file} target="_blank" rel="noreferrer">
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
};

export default CatalogUpload;
