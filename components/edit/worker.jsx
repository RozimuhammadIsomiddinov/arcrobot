import React, { useState, useEffect } from "react";
import { Box, Label, Input, Button } from "@adminjs/design-system";
import axios from "axios";
import { Editor } from "primereact/editor";

// PrimeReact CSS dinamik ulash
const addPrimeStyles = () => {
  const themeUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/themes/lara-light-blue/theme.css";
  const coreUrl =
    "https://cdn.jsdelivr.net/npm/primereact@9.6.0/resources/primereact.min.css";
  const iconsUrl =
    "https://cdn.jsdelivr.net/npm/primeicons@6.0.1/primeicons.css";

  const existing = Array.from(document.head.querySelectorAll("link")).map(
    (l) => l.href
  );

  if (!existing.includes(themeUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themeUrl;
    document.head.appendChild(link);
  }
  if (!existing.includes(coreUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = coreUrl;
    document.head.appendChild(link);
  }
  if (!existing.includes(iconsUrl)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = iconsUrl;
    document.head.appendChild(link);
  }
};

// Editor toolbar
const headerTemplate = (
  <span className="ql-formats">
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-link"></button>
    <button className="ql-clean"></button>
  </span>
);

const WorkerEdit = (props) => {
  const recordId = props.record?.id;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [workerType, setWorkerType] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    addPrimeStyles();

    if (!recordId) {
      setError("ID mavjud emas");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/worker/${recordId}`);
        const data = res.data;

        setName(data.name || "");
        setWorkerType(data.worker_type || "");
        setDescription(data.description || "");
        setImage(data.image || null);
      } catch (err) {
        setError("Ошибка при получении данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("worker_type", workerType);
      formData.append("description", description);

      if (newImage) {
        formData.append("image", newImage);
      } else if (image) {
        formData.append("image", image);
      }

      await axios.put(`/api/worker/${recordId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Работник успешно обновлен!");
      window.location.href = "/admin/resources/worker";
    } catch (err) {
      alert("Ошибка при сохранении:" + err.message);
      console.error(err);
    }
  };

  if (loading) return <Box padding="xl">Загрузка...</Box>;
  if (error)
    return (
      <Box padding="xl" color="red">
        {error}
      </Box>
    );

  return (
    <Box>
      {/* Name */}
      <Box mb="md" width="50%">
        <Label>Имя сотрудника</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          width="100%"
        />
      </Box>

      {/* Worker Type */}
      <Box mb="md" width="50%">
        <Label>Тип сотрудника</Label>
        <Input
          value={workerType}
          onChange={(e) => setWorkerType(e.target.value)}
          placeholder="Введите тип сотрудника"
          width="100%"
        />
      </Box>

      {/* Description */}
      <Box
        mb="md"
        width="70%"
        style={{
          backgroundColor: "rgba(104, 144, 156, 0.1)",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <Label>Описание</Label>
        <Editor
          value={description}
          onTextChange={(e) => setDescription(e.htmlValue)}
          headerTemplate={headerTemplate}
          style={{ height: "250px" }}
        />
      </Box>

      {/* Image */}
      <Box
        mb="md"
        width="50%"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Label>Фотография</Label>

        {/* Eski rasm */}
        {image && !newImage && (
          <Box mb="md" style={{ textAlign: "center" }}>
            <img
              src={image}
              alt="worker"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #007BFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}

        {/* Yangi rasm */}
        {newImage && (
          <Box mb="md" style={{ textAlign: "center" }}>
            <img
              src={URL.createObjectURL(newImage)}
              alt="new-worker"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #28a745",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files.length) {
              setNewImage(e.target.files[0]);
            }
          }}
        />
      </Box>

      <Button variant="primary" mt="lg" onClick={handleSave}>
        Сохранить
      </Button>
    </Box>
  );
};

export default WorkerEdit;
