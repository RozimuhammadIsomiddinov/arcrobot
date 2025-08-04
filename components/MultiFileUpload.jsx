import React, { useState } from "react";
import { Box, Label, Button, Input, TextArea } from "@adminjs/design-system";

import axios from "axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MultiFileUpload = () => {
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
        `${window.location.origin}/upload-multi`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploaded(res.data.data.images || []);
      alert("Все данные успешно сохранены!");
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <Box flex flexDirection="column" alignItems="center" mt="xl" width="100%">
      {/* Title */}
      <Box mb="md" width="60%">
        <Label>Заголовок</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </Box>

      {/* Subtitles */}
      <Box mb="md" width="60%">
        <Label>Подзаголовок</Label>
        <Input
          value={subtitles}
          onChange={(e) => setSubtitles(e.target.value)}
          placeholder="Введите подзаголовок"
        />
      </Box>

      {/* Description */}
      <Box mb="md" width="60%">
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

      {/* Image upload */}
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
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Файл {input.file.name} выбран
            </span>
          )}

          {input.file && input.file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(input.file)}
              alt="preview"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
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

export default MultiFileUpload;
