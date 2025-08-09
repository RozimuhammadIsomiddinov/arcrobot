import React, { useState } from "react";
import { Box, Label, Button, Input } from "@adminjs/design-system";

import axios from "axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState([{ id: Date.now(), file: null }]);
  const [uploaded, setUploaded] = useState([]);

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
        `${window.location.origin}/blog/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploaded(res.data.data.images || []);
      alert("Все данные успешно сохранены!");
      window.location.href = "/admin/resources/blog";
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Title */}
      <Box mb="md" width="50%">
        <Label>Заголовок</Label>
        <Input
          value={title}
          width="100%"
          style={{ padding: "1rem" }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </Box>

      {/* Subtitles */}
      <Box mb="md" width="50%">
        <Label>Подзаголовок</Label>
        <Input
          value={subtitles}
          width="100%"
          style={{ padding: "1rem" }}
          onChange={(e) => setSubtitles(e.target.value)}
          placeholder="Введите подзаголовок"
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="50%">
        <Label>Описание</Label>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          config={{
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Абзац",
                  class: "ck-heading_paragraph",
                },
              ],
            },
          }}
          onReady={(editor) => {
            editor.editing.view.change((writer) => {
              writer.setStyle(
                "color",
                "black",
                editor.editing.view.document.getRoot()
              );
            });
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </Box>

      {/* Images Upload Inputs Container */}
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
      >
        🚀 Сохранить
      </Button>

      <ul style={{ marginTop: "20px", textAlign: "center" }}>
        {uploaded.map((file, idx) => (
          <li key={idx}>
            <a href={file} target="_blank" rel="noreferrer">
              {file}
            </a>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default BlogCreate;
