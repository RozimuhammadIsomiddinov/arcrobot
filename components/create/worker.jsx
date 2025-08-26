import React, { useState, useEffect } from "react";
import { Box, Label, Button, Input } from "@adminjs/design-system";
import axios from "axios";
import { Editor } from "primereact/editor";

// PrimeReact CSS fayllarini dinamik ulash
const addPrimeStyles = () => {
  const themeUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/themes/lara-light-blue/theme.css";
  const coreUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/primereact.min.css";
  const iconsUrl =
    "https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css";

  [themeUrl, coreUrl, iconsUrl].forEach((url) => {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

const WorkerCreate = () => {
  const [name, setName] = useState("");
  const [workerType, setWorkerType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  useEffect(() => {
    addPrimeStyles();
  }, []);

  const handleUpload = async () => {
    if (!name || !workerType || !description) {
      return alert("Заполните все обязательные поля!");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("worker_type", workerType);
      formData.append("description", description);
      if (file) formData.append("image", file);

      const res = await axios.post(
        `${window.location.origin}/api/worker`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploaded(res.data.image || null);
      alert("Сотрудник успешно создан!");
      window.location.href = "/admin/resources/worker";
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + (err.response?.data?.message || err.message));
    }
  };

  // ✨ Editor uchun headerTemplate
  const headerTemplate = (
    <span className="ql-formats">
      {/* Matn stilini sozlash */}
      <select className="ql-font">
        <option selected></option>
        <option value="serif"></option>
        <option value="monospace"></option>
      </select>

      <select className="ql-size">
        <option value="small"></option>
        <option selected></option>
        <option value="large"></option>
        <option value="huge"></option>
      </select>

      {/* Bold, Italic, Underline va Strike */}
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>

      {/* Heading */}
      <select className="ql-header">
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
        <option value="5">H5</option>
        <option value="6">H6</option>
        <option selected>Normal</option>
      </select>

      {/* Ranglar */}
      <select className="ql-color"></select>
      <select className="ql-background"></select>

      {/* Listlar */}
      <button
        className="ql-list"
        value="ordered"
        aria-label="Ordered List"
      ></button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Unordered List"
      ></button>
      <button
        className="ql-indent"
        value="-1"
        aria-label="Decrease Indent"
      ></button>
      <button
        className="ql-indent"
        value="+1"
        aria-label="Increase Indent"
      ></button>

      {/* Align */}
      <select className="ql-align"></select>

      {/* Quote va Code */}
      <button className="ql-blockquote" aria-label="Blockquote"></button>
      <button className="ql-code-block" aria-label="Code Block"></button>

      {/* Link, Image, Video */}
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-image" aria-label="Image"></button>
      <button className="ql-video" aria-label="Video"></button>

      {/* Tozalash */}
      <button className="ql-clean" aria-label="Remove Formatting"></button>
    </span>
  );

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Name */}
      <Box mb="md" width="50%">
        <Label>Имя сотрудника</Label>
        <Input
          value={name}
          width="100%"
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя сотрудника"
        />
      </Box>

      {/* Worker type */}
      <Box mb="md" width="50%">
        <Label>Тип сотрудника</Label>
        <Input
          value={workerType}
          width="100%"
          onChange={(e) => setWorkerType(e.target.value)}
          placeholder="Введите тип сотрудника (например: дизайнер, инженер)"
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="50%">
        <Label>Описание</Label>
        <div
          style={{
            border: "1px solid #ced4da",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <Editor
            value={description}
            onTextChange={(e) => setDescription(e.htmlValue)}
            headerTemplate={headerTemplate}
            style={{ height: "250px", color: "white" }}
          />
        </div>
      </Box>

      {/* Image upload */}
      <Box mb="md" width="50%">
        <Label>Фотография сотрудника</Label>
        <label
          style={{
            display: "inline-block",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          📂 Выбрать файл
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        {file && (
          <Box
            mt="md"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              color: "white",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {file.name}
            </span>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #ccc",
                color: "white",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Save button */}
      <Button
        type="button"
        mt="lg"
        variant="primary"
        onClick={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        style={{
          backgroundColor: "#0d6efd",
          padding: "12px 24px",
          fontSize: "16px",
          color: "white",
        }}
      >
        🚀 Сохранить
      </Button>

      {/* Uploaded preview */}
      {uploaded && (
        <Box mt="xl" width="50%">
          <Label>Загруженное фото:</Label>
          <img
            src={uploaded}
            alt="uploaded"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkerCreate;
