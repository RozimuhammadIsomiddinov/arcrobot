import React, { useState, useEffect } from "react";
import { Box, Label, Button, Input } from "@adminjs/design-system";
import axios from "axios";
import { Editor } from "primereact/editor";

// PrimeReact CSS fayllarini dinamik ravishda qo'shish
const addPrimeStyles = () => {
  const themeUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/themes/lara-light-blue/theme.css";
  const coreUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/primereact.min.css";
  const iconsUrl =
    "https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css";

  const existingLinks = Array.from(document.head.querySelectorAll("link")).map(
    (link) => link.href
  );

  if (!existingLinks.includes(themeUrl)) {
    const themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.href = themeUrl;
    document.head.appendChild(themeLink);
  }

  if (!existingLinks.includes(coreUrl)) {
    const coreLink = document.createElement("link");
    coreLink.rel = "stylesheet";
    coreLink.href = coreUrl;
    document.head.appendChild(coreLink);
  }

  if (!existingLinks.includes(iconsUrl)) {
    const iconsLink = document.createElement("link");
    iconsLink.rel = "stylesheet";
    iconsLink.href = iconsUrl;
    document.head.appendChild(iconsLink);
  }
};

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);
  const [uploaded, setUploaded] = useState([]);

  // PrimeReact stillarini komponent yuklanganda qo'shish
  useEffect(() => {
    addPrimeStyles();
  }, []);

  const handleFileChange = (index, file) => {
    const newInputs = [...inputs];
    newInputs[index].file = file;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length >= 10) {
      alert("Максимум можно загрузить 10 изображений!");
      return;
    }
    setInputs([...inputs, { id: Date.now(), file: null }]);
  };

  const handleUpload = async () => {
    const files = inputs.map((input) => input.file).filter(Boolean);
    if (!files.length) {
      return alert("Выберите хотя бы одно изображение!");
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      formData.append("title", title);
      formData.append("subtitles", subtitles);
      formData.append("description", description);

      const res = await axios.post(
        `${window.location.origin}/api/blog/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploaded(res.data.data.images || []);
      alert("Все данные успешно сохранены!");
      window.location.href = "/admin/resources/blog";
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + (err.response?.data?.message || err.message));
    }
  };

  // Editor uchun toolbar konfiguratsiyasi

  const headerTemplate = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-strike" aria-label="Strike"></button>

      <select className="ql-header">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option selected>Normal</option>
      </select>

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
      <button className="ql-link" aria-label="Link"></button>
      <button className="ql-image" aria-label="Image"></button>
    </span>
  );

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Title */}
      <Box mb="md" width="50%">
        <Label>Заголовок</Label>
        <Input
          value={title}
          width="100%"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </Box>

      {/* Subtitles */}
      <Box mb="md" width="50%">
        <Label>Подзаголовок</Label>
        <textarea
          value={subtitles}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            fontSize: "14px",
            fontFamily: "inherit",
            minHeight: "100px",
            backgroundColor: "black",
            color: "white",
          }}
          onChange={(e) => setSubtitles(e.target.value)}
          placeholder="Введите подзаголовок"
        />
      </Box>

      {/* Description - PrimeReact Editor */}

      <Box
        mb="md"
        width="50%"
        style={{
          padding: "10px",
          borderRadius: "8px",
          color: "white",
        }}
      >
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
            style={{ height: "320px", color: "white" }}
          />
        </div>
      </Box>

      {/* Images Upload */}
      <Label mb="lg" style={{ fontSize: "20px", fontWeight: "bold" }}>
        Изображения (максимум 10)
      </Label>

      <Box
        mb="md"
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "60%",
        }}
      >
        {inputs.map((input, index) => (
          <Box
            key={input.id}
            style={{
              backgroundColor: "rgba(165, 231, 214, 0.8)",
              padding: "10px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              minWidth: "250px",
            }}
          >
            <label
              style={{
                display: "inline-block",
                backgroundColor: "#007bff",
                color: "white",
                padding: "12px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "16px",
                fontWeight: "600",
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
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                Файл {input.file.name} выбран
              </span>
            )}

            {input.file && input.file.type.startsWith("image/") && (
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
            )}
          </Box>
        ))}
      </Box>

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
        style={{
          backgroundColor: "#0d6efd",
          padding: "12px 24px",
          fontSize: "16px",
        }}
      >
        🚀 Сохранить
      </Button>

      {uploaded.length > 0 && (
        <Box mt="xl" width="80%">
          <Label style={{ fontSize: "18px", marginBottom: "10px" }}>
            Загруженные изображения:
          </Label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            {uploaded.map((file, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src={file}
                  alt={`uploaded-${idx}`}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
                <a
                  href={file}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#0d6efd",
                    textDecoration: "none",
                  }}
                >
                  Посмотреть
                </a>
              </div>
            ))}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default BlogCreate;
