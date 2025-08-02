import React, { useState } from "react";
import { Box, Label, Button, Input, TextArea } from "@adminjs/design-system";
import axios from "axios";
import ReactJson from "react-json-view";

// yordamchi funksiya: null yoki noto‘g‘ri qiymatlarni stringga o‘tkazib qo‘yadi
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

  // Property (safe JSON parse)
  const [property, setProperty] = useState(() => {
    try {
      return record?.params?.property ? JSON.parse(record.params.property) : {};
    } catch (err) {
      console.warn("Property JSON emas, fallback ishlatilmoqda:", err);
      return {};
    }
  });

  // Images
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);
  const [uploaded, setUploaded] = useState(() => {
    try {
      return record?.params?.images ? JSON.parse(record.params.images) : [];
    } catch {
      return [];
    }
  });

  // xavfsiz onChange
  const safeOnChange = (field, value) => {
    if (typeof onChange === "function") {
      onChange(field, value);
    }
  };

  // Fayl tanlash
  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  // Input qo'shish
  const addInput = () => {
    if (inputs.length >= 10) {
      return alert("Eng ko'pi 10 ta rasm yuklashingiz mumkin!");
    }
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  // Saqlash
  const handleUpload = async () => {
    const files = inputs.map((i) => i.file).filter(Boolean);
    if (!files.length) {
      return alert("Kamida 1 ta rasm tanlang!");
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

      alert("Catalog muvaffaqiyatli saqlandi!");
      window.location.href = "http://localhost:7007/admin/resources/catalog";
    } catch (err) {
      console.error(err);
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="70%">
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            safeOnChange("name", e.target.value);
          }}
          placeholder="Nomi kiriting"
        />
      </Box>

      {/* Title */}
      <Box mb="md" width="70%">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            safeOnChange("title", e.target.value);
          }}
          placeholder="Title kiriting"
        />
      </Box>

      {/* Property */}
      <Box mb="md" width="70%">
        <Label>Property (JSON)</Label>
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

        {/* Hidden input */}
        <input
          type="hidden"
          value={JSON.stringify(property)}
          onChange={() => {}}
          name="property"
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="70%">
        <Label>Description</Label>
        <TextArea
          rows={6}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            safeOnChange("description", e.target.value);
          }}
          placeholder="Description kiriting"
        />
      </Box>

      {/* Rasmlar */}
      <Label mb="lg" style={{ fontSize: "20px", fontWeight: "bold" }}>
        Rasmlar (eng ko'pi 10 ta)
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
            📂 Fayl tanlash
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
                {input.file.name} tanlandi
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
        style={{ backgroundColor: "rgba(20, 185, 211, 0.8)" }}
      >
        ➕ Rasm qo'shish
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
        🚀 Saqlash
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
